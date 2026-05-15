namespace MojPrevoz.DTOs.UsersDTOs
{
    public class ReportUserDTO
    {
        public int ReporterId { get; set; }
        public int ReportedUserId { get; set; }
        public string ReportReason { get; set; }
    }
}
