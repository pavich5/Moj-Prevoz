namespace MojPrevoz.DTOs.ReviewsDTOs
{
    public class CreateReviewDTO
    {
        public string Text { get; set; }
        public double Stars { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
    }
}
