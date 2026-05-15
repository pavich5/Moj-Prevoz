namespace MojPrevoz.DomainModels.Models
{
    public class BlockedUsers
    {
        public int Id { get; set; }
        public Users BlockingUser { get; set; }
        public int BlockingUserId { get; set; }
        public Users BlockedUser { get; set; }
        public int BlockedUserId { get; set; }

    }
}
