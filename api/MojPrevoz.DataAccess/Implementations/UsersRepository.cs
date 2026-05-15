using Microsoft.EntityFrameworkCore;
using MojPrevoz.DataAccess.DataContext;
using MojPrevoz.DataAccess.Interfaces;
using MojPrevoz.DomainModels.Models;

namespace MojPrevoz.DataAccess.Implementations
{
    public class UsersRepository : IUsersRepository
    {
        private readonly MojPrevozDbContext _dbContext;

        public UsersRepository(MojPrevozDbContext _dbContext)
        {
            this._dbContext = _dbContext;
        }
        public async Task<List<Users>> GetAllAsync()
        {
            return await _dbContext.Users.ToListAsync();
        }
        public async Task<Users> GetByIdAsync(int id)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task CreateAsync(Users entity)
        {
            await _dbContext.Users.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
        }
        public async Task UpdateAsync(Users entity)
        {
            _dbContext.Update(entity);
            await _dbContext.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            Users user = await _dbContext.Users.SingleOrDefaultAsync(x => x.Id == id);

            if (user == null)
                throw new Exception($"User with Id:{id} not found!");

            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Users> GetByEmailAsync(string email)
        {
            // Assuming you have a DbContext or similar to query the database
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<Users> LoginUser(string email, string password)
        {
            return await _dbContext.Users
                .FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower()
                && x.Password.ToLower() == password.ToLower());
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _dbContext.Users.AnyAsync(e => e.Email.ToLower() == email.ToLower());
        }

        //public async Task<Users> GetUserByEmailAndPassword(string email, string hashedPassword)
        //{
        //    return await _dbContext.Users
        //                    .FirstOrDefaultAsync(u => u.Email == email && u.Password == hashedPassword);
        //}

        public async Task<Users> GetUserByPhoneNumberAndPassword(string phoneNumber, string passwordHash)
        {
            return await _dbContext.Users
                .FirstOrDefaultAsync(user => user.PhoneNumber == phoneNumber && user.Password == passwordHash);
        }

        public async Task<bool> PhoneNumberExistsAsync(string phoneNumber)
        {
            return await _dbContext.Users.AnyAsync(e => e.PhoneNumber == phoneNumber);

        }
    }
}
