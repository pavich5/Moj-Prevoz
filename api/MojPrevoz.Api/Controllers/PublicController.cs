using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MojPrevoz.DataAccess.DataContext;
using MojPrevoz.DTOs.MailDTOs;
using MojPrevoz.DTOs.UsersDTOs;
using MojPrevoz.Services.Interfaces;

namespace MojPrevoz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublicController : ControllerBase
    {
        private readonly IUsersService _userService;
        private readonly IMailService _mailService;
        private readonly MojPrevozDbContext _dbContext;
        private static ConcurrentDictionary<string, string> _verificationCodes = new ConcurrentDictionary<string, string>();
        private static List<string> _invalidTokens = new List<string>();
        private readonly IConfiguration _configuration;

        public PublicController(IUsersService _userService, IMailService _mailService, MojPrevozDbContext _dbContext, IConfiguration _configuration)
        {
            this._userService = _userService;
            this._mailService = _mailService;
            this._dbContext = _dbContext;
            this._configuration = _configuration;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDTO loginUserDTO)
        {
            var loginResponse = await _userService.LoginUserAsync(loginUserDTO);

            // Return both the token and the user ID
            return Ok(new
            {
                token = loginResponse.Token,
                userId = loginResponse.UserId
            });
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> CreateUser([FromBody] CreateUserDTO createUserDTO)
        {
            if (createUserDTO == null)
                return BadRequest("The user data cannot be null");

            if (string.IsNullOrEmpty(createUserDTO.JoinedDate) || string.IsNullOrEmpty(createUserDTO.ImageUri) ||
                string.IsNullOrEmpty(createUserDTO.LastName) || string.IsNullOrEmpty(createUserDTO.FirstName) || string.IsNullOrEmpty(createUserDTO.Email) ||
                string.IsNullOrEmpty(createUserDTO.Password))
            {
                return BadRequest("You need to enter all of the params");
            }

            await _userService.CreateUserAsync(createUserDTO);

            // Prepare MailDTO to send welcome email
            var mailData = new MailDTO
            {
                EmailToId = createUserDTO.Email,
                EmailToName = $"{createUserDTO.FirstName} {createUserDTO.LastName}",
                FullName = $"{createUserDTO.FirstName} {createUserDTO.LastName}",
                EmailSubject = "Welcome to Moj Prevoz!",
            };

            // Send welcome email
            var emailSent = await _mailService.SendWelcomeEmailAsync(mailData);
            if (!emailSent)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "User created, but failed to send the welcome email.");
            }

            return StatusCode(StatusCodes.Status201Created, "User created and welcome email sent!");
        }

        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            // Check if the email exists in the database
            var userExists = await _dbContext.Users
                .AnyAsync(x => x.Email == email);

            if (!userExists)
                return NotFound(new { message = "User does not exist. Please try again!" }); // 404 Not Found

            // Generate a 6-digit verification code
            var verificationCode = new Random().Next(100000, 999999).ToString();

            // Store the verification code
            _verificationCodes[email] = verificationCode;

            // Create the email content
            var mailData = new MailDTO
            {
                EmailToId = email,
                EmailToName = "User", // You might want to get the user's name if available
                EmailSubject = "Reseting Password",
                EmailBody = $"Your verification code is: {verificationCode}",
                VerifyCode = verificationCode,
            };

            // Send the email
            var result = await _mailService.SendForgotPasswordMailAsync(mailData);

            return Ok(new { message = "Verification email sent successfully." }); // 200 OK
        }

        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO resetPasswordDTO)
        {
            if (string.IsNullOrEmpty(resetPasswordDTO.Email) || string.IsNullOrEmpty(resetPasswordDTO.NewPassword))
                return BadRequest("Email and new password are required.");

            string email;

            // Case 1: Forgot Password Flow
            if (resetPasswordDTO.IsFromForgotPassword == true)
            {
                if (string.IsNullOrEmpty(resetPasswordDTO.Token))
                    return BadRequest("Token is required for forgot password.");

                // Validate the token and extract the email from it
                var principal = ValidateJwtToken(resetPasswordDTO.Token);
                if (principal == null)
                    return Unauthorized("Invalid or expired token.");

                email = principal.FindFirst(ClaimTypes.Email)?.Value;

                if (email != resetPasswordDTO.Email)
                    return Unauthorized("Invalid token or email mismatch.");

                // Optionally: Blacklist the token after successful password reset
                InvalidateJwtToken(resetPasswordDTO.Token);

                // Check if the user exists
                var user = await _userService.GetUserByEmailAsync(resetPasswordDTO.Email);
                if (user == null)
                    return NotFound("User not found.");

                // Update the user's password
                await _userService.UpdatePasswordAsync(resetPasswordDTO.Email, resetPasswordDTO.OldPassword, resetPasswordDTO.NewPassword);
            }
            else
            {
                // Case 2: Logged-In User Flow
                // Get email from the JWT token in the Authorization header
                var userDetails = await _userService.GetUserByEmailAsync(resetPasswordDTO.Email);
                if (userDetails == null)
                    return NotFound("User not found.");

                // Update the user's password, optionally checking the old password
                await _userService.UpdatePasswordAsync(resetPasswordDTO.Email, resetPasswordDTO.OldPassword, resetPasswordDTO.NewPassword);
            }

            return Ok("Password has been reset successfully.");
        }

        [AllowAnonymous]
        [HttpPost("verify-code")]
        public IActionResult VerifyCode([FromBody] VerificationRequest request)
        {
            if (_verificationCodes.TryGetValue(request.Email, out var storedCode))
            {
                if (storedCode == request.Code)
                {
                    // Optionally remove the code after verification
                    _verificationCodes.TryRemove(request.Email, out _);

                    // Generate JWT token
                    var token = GenerateJwtToken(request.Email);

                    return Ok(new { success = true, token = token }); // Return the token
                }
                return BadRequest(new { message = "Invalid verification code." }); // 400 Bad Request
            }
            return NotFound(new { message = "Verification code not found." }); // 404 Not Found
        }

        private string GenerateJwtToken(string email)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["AppSettings:Secret"]); // Use a secret key from configuration

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
            new Claim(ClaimTypes.Email, email)
                }),
                Expires = DateTime.UtcNow.AddMinutes(20), // Token expiry
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


        private ClaimsPrincipal ValidateJwtToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["AppSettings:Secret"]); // Use your secret key

            try
            {
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false, // You can specify your issuer if needed
                    ValidateAudience = false, // You can specify your audience if needed
                    ClockSkew = TimeSpan.Zero, // Disable the default 5-minute clock skew
                    ValidateLifetime = true // Ensure token hasn't expired
                };

                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken validatedToken);

                // Ensure that the token is a JWT token
                if (validatedToken is JwtSecurityToken jwtToken && jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                    return principal; // Return the claims principal if token is valid
                else
                    return null; // Token is not valid
            }
            catch (SecurityTokenException)
            {
                return null; // Token validation failed (invalid or expired)
            }
        }

        private void InvalidateJwtToken(string token)
        {
            // This could be an in-memory list or persisted storage, based on your requirements
            if (!string.IsNullOrEmpty(token))
            {
                // Remove "Bearer " from token if it's part of the Authorization header
                var cleanToken = token.Replace("Bearer ", string.Empty);
                _invalidTokens.Add(cleanToken); // Add token to a blacklist
            }
        }

    }
}
