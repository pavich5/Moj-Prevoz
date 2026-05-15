using Microsoft.AspNetCore.Mvc;
using MojPrevoz.DataAccess.Interfaces;
using MojPrevoz.Services.Interfaces;

namespace MojPrevoz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TwilioController : ControllerBase
    {
        private readonly ITwilioService _twilioService;
        private readonly IUsersRepository _userRepository;

        // In-memory storage for the latest verification code (replace with a DB or cache for production)
        private static string latestVerificationCode;

        public TwilioController(ITwilioService twilioService, IUsersRepository _userRepository)
        {
            _twilioService = twilioService;
            this._userRepository = _userRepository;
        }

        [HttpPost("send-sms")]
        public async Task<IActionResult> SendSms([FromBody] SmsRequest request)
        {
            if (await _userRepository.PhoneNumberExistsAsync(request.To))
                return BadRequest("Phone number already exists.");

            if (string.IsNullOrWhiteSpace(request.To))
                return BadRequest("Phone number is required.");

            // Generate a random 6-digit code
            var verificationCode = GenerateVerificationCode();

            // Store the latest generated verification code
            latestVerificationCode = verificationCode;

            // Send the SMS
            await _twilioService.SendMessageAsync(request.To, verificationCode);

            return Ok(new { message = "SMS Sent!", code = verificationCode });
        }

        [HttpPost("verify-sms-code")]
        public IActionResult VerifyCode([FromBody] VerifyCodeRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Code))
                return BadRequest("Verification code is required.");

            // Check if the provided code matches the latest generated verification code
            if (latestVerificationCode == request.Code)
                return Ok("Verification successful!");
            else
                return BadRequest("Invalid verification code.");
        }

        private string GenerateVerificationCode()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString(); // Generates a 6-digit code
        }
    }

    // DTO for sending SMS
    public class SmsRequest
    {
        public string To { get; set; }
    }

    // DTO for verifying code
    public class VerifyCodeRequest
    {
        public string Code { get; set; }
    }
}
