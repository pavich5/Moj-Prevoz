using MojPrevoz.DomainModels.Models;

namespace MojPrevoz.DataAccess.Interfaces
{
    public interface IPostsRepository
    {
        Task<List<Posts>> GetAllAsync(int loggedUserId);
        Task<Posts> GetByIdAsync(int id);
        Task CreateAsync(Posts entity);
        Task UpdateAsync(Posts entity);
        Task DeleteAsync(int id);

    }
}
