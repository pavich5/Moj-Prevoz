namespace MojPrevoz.DataAccess.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using MojPrevoz.DataAccess.DataContext;
    using MojPrevoz.DataAccess.Interfaces;
    using MojPrevoz.DomainModels.Models;

    public class ReviewsRepository : IReviewsRepository
    {
        private readonly MojPrevozDbContext _dbContext;
        public ReviewsRepository(MojPrevozDbContext _dbContext)
        {
            this._dbContext = _dbContext;
        }
        public async Task<List<Reviews>> GetAllAsync(int receiverId)
        {
            return await _dbContext.Reviews
                   .Where(r => r.ReceiverId == receiverId)
                   .Include(r => r.Receiver)
                   .Include(r => r.Sender)
                   .ToListAsync();
        }
        public async Task<Reviews> GetByIdAsync(int id)
        {
            return await _dbContext.Reviews.FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task CreateAsync(Reviews entity)
        {
            await _dbContext.Reviews.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
        }
        public async Task UpdateAsync(Reviews entity)
        {
            _dbContext.Update(entity);
            await _dbContext.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            Reviews reviewDb = await _dbContext.Reviews.SingleOrDefaultAsync(x => x.Id == id);

            if (reviewDb == null)
                throw new Exception($"Review with Id:{id} not found!");

            _dbContext.Reviews.Remove(reviewDb);
            await _dbContext.SaveChangesAsync();
        }
    }
}
