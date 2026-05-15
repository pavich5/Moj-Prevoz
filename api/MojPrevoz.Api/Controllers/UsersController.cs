using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using MojPrevoz.DataAccess.DataContext;
using MojPrevoz.DataAccess.Interfaces;
using MojPrevoz.DomainModels.Models;
using MojPrevoz.DTOs.MailDTOs;
using MojPrevoz.DTOs.UsersDTOs;
using MojPrevoz.Helpers;
using MojPrevoz.Services.Implementations;
using MojPrevoz.Services.Interfaces;

namespace MojPrevoz.Controllers
{
    [PrivateKeyAuthorize]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _userService;
        public readonly IUsersRepository _userRepository;
        private readonly FirebaseStorageService _firebaseStorageService;
        private readonly IMailService _mailService;
        private readonly TokenBlocklistService _tokenBlocklistService;
        private static ConcurrentDictionary<string, string> _verificationCodes = new ConcurrentDictionary<string, string>();
        private readonly MojPrevozDbContext _dbContext;
        private readonly IConfiguration _configuration;


        public UsersController(IUsersService userService, IMailService mailService, TokenBlocklistService tokenBlocklistService, FirebaseStorageService _firebaseStorageService, MojPrevozDbContext _dbContext, IConfiguration _configuration, IUsersRepository _userRepository)
        {
            _userService = userService;
            _mailService = mailService;
            _tokenBlocklistService = tokenBlocklistService;
            this._firebaseStorageService = _firebaseStorageService;
            this._dbContext = _dbContext;
            this._configuration = _configuration;
            this._userRepository = _userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<UsersDTO>>> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UsersDTO>> GetUser(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid input for id");

            UsersDTO userDTO = await _userService.GetUserAsync(id);
            if (userDTO == null)
                return NotFound($"User with id:{id} not found");

            return Ok(userDTO);
        }


        [HttpPost("report-user")]
        public async Task<IActionResult> ReportUser([FromBody] ReportUserDTO reportUserDto)
        {
            if (reportUserDto == null || string.IsNullOrEmpty(reportUserDto.ReportReason))
                return BadRequest("Report reason is required.");

            // Fetch reporter details
            var reporter = await _dbContext.Users.FindAsync(reportUserDto.ReporterId);
            if (reporter == null)
                return NotFound("Reporter not found.");

            // Fetch reported user details
            var reportedUser = await _dbContext.Users.FindAsync(reportUserDto.ReportedUserId);
            if (reportedUser == null)
                return NotFound("Reported user not found.");

            // Prepare email data
            var emailBody = $@"
            <div style='font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;'>
                <h2 style='color: #d32f2f; text-align: center;'>User Report Notification</h2>
                <p style='font-size: 16px; color: #333;'>
                    <strong>Reporter Id:</strong> {reportUserDto.ReporterId}<br>
                    <strong>Reporter Name:</strong> {reporter.FirstName} {reporter.LastName}<br>
                    <strong>Reporter Email:</strong> {reporter.Email}<br>
                    <strong>Reported User Id:</strong> {reportUserDto.ReportedUserId}<br>
                    <strong>Reported User Name:</strong> {reportedUser.FirstName} {reportedUser.LastName}<br>
                    <strong>Reported User Email:</strong> {reportedUser.Email}<br>
                    <strong>Reason for Report:</strong> {reportUserDto.ReportReason}<br>
                </p>
                <hr style='border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;'/>
                <p style='font-size: 14px; color: #999;'>This is an automated message. Please do not reply.</p>
            </div>";

            var mailData = new MailDTO
            {
                EmailToId = "novoselskiantonio@gmail.com", // Primary recipient
                EmailToName = "Antonio Novoselski", // Name of primary recipient
                EmailSubject = "User Report Notification",
                FullName = "Admin", // Placeholder for sender's full name
            };

            // Send the email to both addresses
            var emailSent = await _mailService.SendReportUserEmailAsync(mailData, emailBody, "antoniopavic.dev@gmail.com");

            if (!emailSent)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to send the report email.");
            }

            return Ok("Report has been successfully submitted.");
        }


        [HttpPatch("edit-theme-color")]
        public async Task<IActionResult> EditThemeColor([FromBody] EditThemeDTO editThemeDTO)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == editThemeDTO.UserId);

            if (user == null)
                return NotFound("User not found");

            user.IsThemeWhite = editThemeDTO.IsThemeWhite;

            await _dbContext.SaveChangesAsync();

            return Ok("User updated successfully");
        }

        [HttpPatch]
        public async Task<IActionResult> EditUser([FromBody] EditUserDTO editUserDTO)
        {
            if (editUserDTO == null)
                return BadRequest("Invalid input");

            if (editUserDTO.Id <= 0)
                return BadRequest("Invalid Id. Please try again");

            await _userService.EditUserAsync(editUserDTO);

            return Ok("User updated successfully");
        }

        [HttpPatch("saveNotificationToken")]
        public async Task<IActionResult> SaveNotificationToken([FromBody] SaveNotificationTokenDTO saveNotificationTokenDTO)
        {
            if (saveNotificationTokenDTO == null)
                return BadRequest("Invalid input");

            if (saveNotificationTokenDTO.UserId <= 0)
                return BadRequest("Invalid Id. Please try again");

            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == saveNotificationTokenDTO.UserId);

            user.NotificationToken = saveNotificationTokenDTO.NotificationToken;

            await _dbContext.SaveChangesAsync();

            return Ok("Notification Token updated successfully");
        }

        //[HttpPost("upload-photo")]
        //[AllowAnonymous]
        //public async Task<IActionResult> UploadPhoto(IFormFile file)
        //{
        //    if (file == null || file.Length == 0)
        //        return BadRequest("No file uploaded.");

        //    // Generate a unique file name
        //    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

        //    using (var fileStream = file.OpenReadStream())
        //    {
        //        // Call Firebase storage service to upload the file
        //        string fileUrl = await _firebaseStorageService.UploadFileAsync(fileStream, fileName);
        //        return Ok(new { fileUrl });
        //    }
        //}

        [HttpPost("logout")]
        public IActionResult Logout([FromBody] LogoutDTO logoutDTO)
        {
            // Validate that the token is provided
            if (string.IsNullOrEmpty(logoutDTO.Token))
                return BadRequest("Token is required for logout.");

            // Add the token to the blocklist to invalidate it
            _tokenBlocklistService.BlockToken(logoutDTO.Token);

            return Ok(new { message = "User has been logged out and token invalidated." });
        }

        [HttpPost("block-user")]
        public async Task<IActionResult> BlockUser([FromBody] BlockUserDTO blockUserDto)
        {
            if (blockUserDto.BlockingUserId == blockUserDto.BlockedUserId)
                return BadRequest("A user cannot block themselves.");

            var blockingUserExists = await _dbContext.Users.AnyAsync(u => u.Id == blockUserDto.BlockingUserId);
            var blockedUserExists = await _dbContext.Users.AnyAsync(u => u.Id == blockUserDto.BlockedUserId);

            if (!blockingUserExists || !blockedUserExists)
                return NotFound("One or both users do not exist.");

            var blockedUser = new BlockedUsers
            {
                BlockingUserId = blockUserDto.BlockingUserId,
                BlockedUserId = blockUserDto.BlockedUserId
            };

            _dbContext.BlockedUsers.Add(blockedUser);
            await _dbContext.SaveChangesAsync();

            return Ok("User has been blocked successfully.");
        }

        [HttpGet("blocked-users/{userId}")]
        public async Task<ActionResult<List<BlockedUsersDTO>>> GetBlockedUsers(int userId)
        {
            // Check if the user exists
            var userExists = await _dbContext.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
                return NotFound("User not found.");

            // Get blocked users
            var blockedUsers = await _dbContext.BlockedUsers
                .Where(bu => bu.BlockingUserId == userId)
                .Include(bu => bu.BlockedUser)
                .Select(bu => new BlockedUsersDTO
                {
                    Id = bu.BlockedUser.Id,
                    FirstName = bu.BlockedUser.FirstName,
                    LastName = bu.BlockedUser.LastName,
                    Image = bu.BlockedUser.ImageUri
                })
                .ToListAsync();

            if (!blockedUsers.Any())
                return new List<BlockedUsersDTO>();

            return Ok(blockedUsers);
        }

        [HttpDelete("unblock-user")]
        public async Task<IActionResult> UnblockUser([FromBody] BlockUserDTO unblockUserDto)
        {
            if (unblockUserDto.BlockingUserId == unblockUserDto.BlockedUserId)
                return BadRequest("A user cannot unblock themselves.");

            // Find the blocked user record
            var blockedUser = await _dbContext.BlockedUsers
                .FirstOrDefaultAsync(bu => bu.BlockingUserId == unblockUserDto.BlockingUserId && bu.BlockedUserId == unblockUserDto.BlockedUserId);

            if (blockedUser == null)
                return NotFound("The specified user is not blocked.");

            // Remove the blocked user record
            _dbContext.BlockedUsers.Remove(blockedUser);
            await _dbContext.SaveChangesAsync();

            return Ok("User has been unblocked successfully.");
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid input for id.");

            UsersDTO usersDTO = await _userService.GetUserAsync(id);

            if (usersDTO == null)
                return NotFound("User not found.");

            await _userService.DeleteUserAsync(usersDTO.Id);
            return Ok("User deleted successfully.");
        }

        public class LogoutDTO
        {
            public string Token { get; set; }
        }
    }
}
