namespace MojPrevoz.DTOs.MailDTOs
{
    public class MailDTO
    {
        public string? EmailToId { get; set; }
        public string? EmailToName { get; set; }
        public string? EmailSubject { get; set; }
        public string? EmailBody { get; set; }
        public string? VerifyCode { get; set; }
        public string? FullName { get; set; }
    }
}
