using MojPrevoz.DomainModels.Enums;

namespace MojPrevoz.DomainModels.Models
{
    public class Users
    {
        public int Id { get; set; } // Assuming you have a primary key for the user
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string JoinedDate { get; set; } // Format: "11.11.2024"
        public List<SavedPosts> SavedPosts { get; set; }
        public string ImageUri { get; set; }
        public string DateOfBirth { get; set; }
        public string? PhoneNumber { get; set; }
        public string Email { get ; set; }
        public string? NotificationToken { get; set; }
        public string Password { get; set; } // Store the hashed password
        public bool IsThemeWhite { get; set; } = true;
        public List<Posts> Posts { get; set; }  
        public List<Reviews> ReceivedReviews { get; set; }
        public List<Reviews> SentReviews { get; set; }
        //public List<Messages> SentMessages { get; set; }
        //public List<Messages> ReceivedMessages { get; set; }
    }
}
