namespace MojPrevoz.DTOs.UsersDTOs
{
    public class UsersDTO
    {
        public int Id { get; set; } 
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string JoinedDate { get; set; } // Format: "11.11.2024"
        public string ImageUri { get; set; }
        public string? PhoneNumber { get; set; }
        public bool IsThemeWhite { get; set; }
        public int NewMessagesCount { get; set; }
        public string Email { get; set; }
        public int Age { get; set; }
        public string Password { get; set; } // Store the hashed password
    }
}
