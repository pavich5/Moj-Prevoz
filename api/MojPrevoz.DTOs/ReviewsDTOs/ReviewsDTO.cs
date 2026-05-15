using MojPrevoz.DomainModels.Models;

namespace MojPrevoz.DTOs.ReviewsDTOs
{
    public class ReviewsDTO
    {
        public int Id { get; set; } // Primary key
        public int? SenderId { get; set; }
        public string Text { get; set; }
        public double Stars { get; set; }
        public string SenderName { get; set; }
        public string ImageUri { get; set; }
        public string Date { get; set; }
    }
}
