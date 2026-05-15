using MojPrevoz.DomainModels.Enums;
using MojPrevoz.DomainModels.Models;

namespace MojPrevoz.DTOs.SavedPostsDTOs
{
    public class SavedPostsDTO
    {
        public int UserId { get; set; } // The ID of the user who saved the post
        public int Id { get; set; }
        public string StartingLocation { get; set; }
        public string EndLocation { get; set; }
        public string Time { get; set; } // Format: HH:MM
        public string PhoneNumber { get; set; }
        public string Date { get; set; } // Format: DD.MM.YYYY
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ImageUri { get; set; }
        public string Type { get; set; } // Either "driver" or "passenger"
        public int Price { get; set; } // E.g., "500"
        public string? PickUpLocation { get; set; } // Nullable, specific to driver
        public string? StopByLocations { get; set; } // Nullable, comma-separated string, specific to driver
        public string? Luggage { get; set; } // Nullable, specific to passenger
        public int? SeatsNeeded { get; set; } // Nullable, specific to passenger
        public DateTime CreatedDate { get; set; }
        public int? SeatsAvailable { get; set; } // Nullable, specific to driver
        public bool? ShowPrice { get; set; } // Nullable, whether to show the price in the UI
        public List<int> SavedByUserIds { get; set; }
    }
}
