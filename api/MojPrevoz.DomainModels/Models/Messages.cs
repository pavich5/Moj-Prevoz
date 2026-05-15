using System.Text.Json.Serialization;
using MojPrevoz.DomainModels.Enums;

namespace MojPrevoz.DomainModels.Models
{
    public class Messages
    {
        public int Id { get; set; }

        [JsonIgnore]
        public Users Receiver { get; set; }
        public int? ReceiverId { get; set; }
        public Users Sender { get; set; }
        public int? SenderId { get; set; }
        public string Message { get; set; } = string.Empty;
        public MessageStatus MessageStatus { get; set; }
        public string Date { get; set; }
    }
}
