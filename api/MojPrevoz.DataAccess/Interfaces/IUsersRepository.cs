namespace MojPrevoz.DataAccess.Interfaces
{
    using MojPrevoz.DomainModels.Models;
    public interface IUsersRepository : IRepository<Users>
    {
        Task<Users> LoginUser(string email, string password);
        Task<bool> EmailExistsAsync(string email);
        Task<bool> PhoneNumberExistsAsync(string phoneNumber);
        //Task<Users> GetUserByEmailAndPassword(string email, string hashedPassword);
        Task<Users> GetUserByPhoneNumberAndPassword(string phoneNumber, string passwordHash);
        Task<Users> GetByEmailAsync(string email); // New method
    }
}
