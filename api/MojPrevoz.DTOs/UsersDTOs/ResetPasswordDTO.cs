namespace MojPrevoz.DTOs.UsersDTOs
{
    public class ResetPasswordDTO
    {
        public string Email { get; set; }
        public string? OldPassword { get; set; }
        public string NewPassword { get; set; }
        public bool? IsFromForgotPassword { get; set; } = false;
        public string? Token { get; set; } 
    }
}
