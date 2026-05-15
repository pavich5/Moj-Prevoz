namespace MojPrevoz.DTOs.PostsDTOs
{
    public class ReportPostDTO
    {
        public int UserId { get; set; }
        public int PostId { get; set; } // ID of the post being reported
        public string ReportReason { get; set; } // Reason for reporting
    }
}
