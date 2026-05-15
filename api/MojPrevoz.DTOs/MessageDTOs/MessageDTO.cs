namespace MojPrevoz.DTOs.MessageDTOs
{
    public class MessageDTO
    {
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
