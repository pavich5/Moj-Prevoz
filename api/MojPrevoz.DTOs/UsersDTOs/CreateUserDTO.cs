namespace MojPrevoz.DTOs.UsersDTOs
{
    public class CreateUserDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string JoinedDate { get; set; } // Format: "11.11.2024"
        public string? ImageUri { get; set; }
        public string PhoneNumber { get; set; }
        public string DateOfBirth { get; set; }
        public string Email { get; set; }
        public string Password { get; set; } // Store the hashed password
    }
}
