namespace MojPrevoz.DataAccess.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using MojPrevoz.DataAccess.DataContext;
    using MojPrevoz.DataAccess.Interfaces;
    using MojPrevoz.DomainModels.Models;

    public class PostsRepository : IPostsRepository
    {
        private readonly MojPrevozDbContext _dbContext;

        public PostsRepository(MojPrevozDbContext _dbContext)
        {
            this._dbContext = _dbContext;
        }
        public async Task<List<Posts>> GetAllAsync(int loggedUserId)
        {
            // Get blocked users
            var blockedUsers = await _dbContext.BlockedUsers
                                                .Where(bu => bu.BlockingUserId == loggedUserId || bu.BlockedUserId == loggedUserId)
                                                .Select(bu => bu.BlockingUserId == loggedUserId ? bu.BlockedUserId : bu.BlockingUserId)
                                                .Distinct()
                                                .ToListAsync();

            // Get posts excluding blocked users
            return await _dbContext.Posts
                                   .Include(x => x.User)
                                   .Where(p => !blockedUsers.Contains(p.UserId))
                                   .ToListAsync();
        }
        public async Task<Posts> GetByIdAsync(int id)
        {
            return await _dbContext.Posts
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task CreateAsync(Posts entity)
        {
            await _dbContext.Posts.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
        }
        public async Task UpdateAsync(Posts entity)
        {
            _dbContext.Update(entity);
            await _dbContext.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            Posts postsDb = await _dbContext.Posts.SingleOrDefaultAsync(x => x.Id == id);

            if (postsDb == null)
                throw new Exception($"Post with Id:{id} not found!");

            _dbContext.Posts.Remove(postsDb);
            await _dbContext.SaveChangesAsync();
        }
    }
}
