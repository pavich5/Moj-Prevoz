namespace MojPrevoz.DomainModels.Models
{
    public class Reviews
    {
        public int Id { get; set; } // Primary key
        public int? SenderId { get; set; }
        public Users? Sender { get; set; } // Navigation property back to the Users class
        public int? ReceiverId { get; set; }
        public Users? Receiver { get; set; } // Navigation property back to the Users class
        public string Text { get; set; }
        public double Stars { get; set; }
        public string Date { get; set; } // Format: DD.MM.YYYY

    }
}
