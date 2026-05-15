namespace MojPrevoz.DTOs.PostsDTOs
{
    public class CreatePostDTO
    {
        public string StartingLocation { get; set; }
        public string EndLocation { get; set; }
        public int UserId { get; set; }
        public string Time { get; set; } // Format: HH:MM
        public string Date { get; set; } // Format: DD.MM.YYYY
        public string Type { get; set; } // Either "driver" or "passenger"
        public int Price { get; set; } // E.g., "500"
        public string? PhoneNumber { get; set; }
        public string? PickUpLocation { get; set; } // Nullable, specific to driver
        public string? StopByLocations { get; set; } // Nullable, comma-separated string, specific to driver
        public string? Luggage { get; set; } // Nullable, specific to passenger
        public int? SeatsNeeded { get; set; } // Nullable, specific to passenger
        public int? SeatsAvailable { get; set; } // Nullable, specific to driver
        public bool? ShowPrice { get; set; } // Nullable, whether to show the price in the UI
    }
}
