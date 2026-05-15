namespace MojPrevoz.DomainModels.Models
{
    public class SavedPosts
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public Users User { get; set; }
        public int PostId { get; set; }
        public Posts Post { get; set; }
    }
}
