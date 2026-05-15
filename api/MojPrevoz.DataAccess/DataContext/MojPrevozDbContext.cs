namespace MojPrevoz.DataAccess.DataContext
{
    using Microsoft.EntityFrameworkCore;
    using MojPrevoz.DomainModels.Models;

    public class MojPrevozDbContext : DbContext
    {
        public MojPrevozDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Posts> Posts { get; set; }
        public DbSet<Reviews> Reviews { get; set; }
        public DbSet<SavedPosts> SavedPosts { get; set; }
        public DbSet<Messages> Messages { get; set; }
        public DbSet<BlockedUsers> BlockedUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Users entity
            modelBuilder.Entity<Users>()
                .Property(u => u.FirstName)
                .HasMaxLength(64);

            modelBuilder.Entity<Users>()
                .Property(u => u.LastName)
                .HasMaxLength(64);

            modelBuilder.Entity<Users>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Configure Posts entity with CASCADE on delete
            modelBuilder.Entity<Posts>()
                .HasOne(x => x.User)
                .WithMany(x => x.Posts)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure SavedPosts entity with CASCADE on delete
            modelBuilder.Entity<SavedPosts>()
                .HasOne(x => x.User)
                .WithMany(x => x.SavedPosts)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SavedPosts>()
                .HasOne(x => x.Post)
                .WithMany(x => x.SavedPosts)
                .HasForeignKey(x => x.PostId);

            // Configure Reviews entity with SET NULL on delete
            modelBuilder.Entity<Reviews>()
                .HasOne(x => x.Receiver)
                .WithMany(x => x.ReceivedReviews)
                .HasForeignKey(x => x.ReceiverId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Reviews>()
                .HasOne(x => x.Sender)
                .WithMany(x => x.SentReviews)
                .HasForeignKey(x => x.SenderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BlockedUsers>()
                .HasOne(bu => bu.BlockingUser)
                .WithMany()
                .HasForeignKey(bu => bu.BlockingUserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BlockedUsers>()
                .HasOne(bu => bu.BlockedUser)
                .WithMany()
                .HasForeignKey(bu => bu.BlockedUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }


        //modelBuilder.Entity<Messages>()
        //    .HasOne(m => m.Sender)
        //    .WithMany(u => u.SentMessages)
        //    .HasForeignKey(m => m.SenderId)
        //    .OnDelete(DeleteBehavior.Restrict);

        //modelBuilder.Entity<Messages>()
        //    .HasOne(m => m.Receiver)
        //    .WithMany(u => u.ReceivedMessages)
        //    .HasForeignKey(m => m.ReceiverId)
        //    .OnDelete(DeleteBehavior.Restrict);

    }
}


