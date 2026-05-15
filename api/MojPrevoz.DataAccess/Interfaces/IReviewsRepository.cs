
namespace MojPrevoz.DataAccess.Interfaces
{
    using MojPrevoz.DomainModels.Models;
    public interface IReviewsRepository
    {
        Task<List<Reviews>> GetAllAsync(int userId);
        Task<Reviews> GetByIdAsync(int id);
        Task CreateAsync(Reviews entity);
        Task UpdateAsync(Reviews entity);
        Task DeleteAsync(int id);
    }
}
