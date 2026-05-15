namespace MojPrevoz.Services.Implementations
{
    using Microsoft.Extensions.Configuration;
    using Microsoft.IdentityModel.Tokens;
    using System.Collections.Generic;
    using System.Data;
    using System.IdentityModel.Tokens.Jwt;
    using System.Security.Claims;
    using System.Text;
    using System.Threading.Tasks;
    using MojPrevoz.DataAccess.DataContext;
    using MojPrevoz.DataAccess.Interfaces;
    using MojPrevoz.DomainModels.Models;
    using MojPrevoz.DTOs.UsersDTOs;
    using MojPrevoz.Mappers;
    using MojPrevoz.Services.Interfaces;
    using XSystem.Security.Cryptography;

    public class UsersService : IUsersService
    {
        private readonly IUsersRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly MojPrevozDbContext _dbContext;

        public UsersService(IUsersRepository _userRepository, IConfiguration _configuration, MojPrevozDbContext _dbContext)
        {
            this._userRepository = _userRepository;
            this._configuration = _configuration;
            this._dbContext = _dbContext;
        }
        public async Task<List<UsersDTO>> GetAllUsersAsync()
        {
            List<Users> usersDb = await _userRepository.GetAllAsync();

            if (usersDb == null)
                throw new Exception("Contact the support team");

            return usersDb.Select(u => u.ToUsersDTO(_dbContext)).ToList();
        }
        public async Task<UsersDTO> GetUserAsync(int id)
        {
            Users usersDb = await _userRepository.GetByIdAsync(id);

            if (usersDb == null)
                throw new Exception("Contact the support team");

            return usersDb.ToUsersDTO(_dbContext);
        }
        public async Task CreateUserAsync(CreateUserDTO createUserDTO)
        {
            try
            {
                if (await _userRepository.EmailExistsAsync(createUserDTO.Email))
                    throw new ArgumentException("Email or phone number already exist.");

                if (await _userRepository.PhoneNumberExistsAsync(createUserDTO.PhoneNumber))
                    throw new ArgumentException("Email or phone number already exist.");

                // Hash the password using MD5
                MD5CryptoServiceProvider mD5CryptoServiceProvider = new MD5CryptoServiceProvider();

                //Test123 -> 94378439
                byte[] passwordBytes = Encoding.ASCII.GetBytes(createUserDTO.Password);

                //get the bytes of the hash string/password
                byte[] hashBytes = mD5CryptoServiceProvider.ComputeHash(passwordBytes);

                //get the hash as string
                string hash = Encoding.ASCII.GetString(hashBytes);

                //3. Create the User and add it to the DataBase
                Users user = new Users()
                {
                    FirstName = createUserDTO.FirstName,
                    Email = createUserDTO.Email,
                    LastName = createUserDTO.LastName,
                    Password = hash,
                    ImageUri = createUserDTO.ImageUri,
                    JoinedDate = createUserDTO.JoinedDate,
                    PhoneNumber = createUserDTO.PhoneNumber,
                    DateOfBirth = createUserDTO.DateOfBirth
                };

                await _userRepository.CreateAsync(user);
            }
            catch (Exception ex)
            {
                throw new Exception("Email or phone number already exists!", ex);
            }
        }
        public async Task EditUserAsync(EditUserDTO editUserDTO)
        {
            // Retrieve the user from the repository
            Users usersDb = await _userRepository.GetByIdAsync(editUserDTO.Id);

            if (usersDb == null)
                throw new Exception("The user cannot be found");

            // Update user properties
            usersDb.Email = editUserDTO.Email;
            usersDb.FirstName = editUserDTO.FirstName;
            usersDb.LastName = editUserDTO.LastName;
            usersDb.PhoneNumber = editUserDTO.PhoneNumber;
            usersDb.ImageUri = editUserDTO.ImageUri;

            // Save changes
            await _userRepository.UpdateAsync(usersDb);
        }

        public async Task<LoginResponseDTO> LoginUserAsync(LoginUserDTO loginUserDto)
        {
            if (string.IsNullOrEmpty(loginUserDto.PhoneNumber) || string.IsNullOrEmpty(loginUserDto.Password))
                throw new Exception("Phone number and password are required");

            MD5CryptoServiceProvider mD5CryptoServiceProvider = new MD5CryptoServiceProvider();

            byte[] passwordBytes = Encoding.ASCII.GetBytes(loginUserDto.Password);
            byte[] hashBytes = mD5CryptoServiceProvider.ComputeHash(passwordBytes);
            string hash = Encoding.ASCII.GetString(hashBytes);

            // Find user in the database using the phone number
            Users userDb = await _userRepository.GetUserByPhoneNumberAndPassword(loginUserDto.PhoneNumber, hash);

            if (userDb == null)
                throw new Exception("User not found");

            JwtSecurityTokenHandler jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["AppSettings:Secret"]);

            SecurityTokenDescriptor securityTokenDescriptor = new SecurityTokenDescriptor()
            {
                Expires = DateTime.UtcNow.AddYears(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Subject = new ClaimsIdentity(
                    new[]
                    {
                new Claim(ClaimTypes.NameIdentifier, userDb.Id.ToString()) // Adding the Id as a NameIdentifier claim
                    })
            };

            // Generate JWT token
            SecurityToken token = jwtSecurityTokenHandler.CreateToken(securityTokenDescriptor);
            string tokenString = jwtSecurityTokenHandler.WriteToken(token);

            // Return both the token and the user ID
            return new LoginResponseDTO
            {
                Token = tokenString,
                UserId = userDb.Id // Return user ID
            };
        }

        public async Task<UsersDTO> GetUserByEmailAsync(string email)
        {
            // Retrieve the user by email from the repository
            Users userDb = await _userRepository.GetByEmailAsync(email);

            if (userDb == null)
                return null;

            return userDb.ToUsersDTO(_dbContext);
        }

        public async Task UpdatePasswordAsync(string email, string? oldPassword, string newPassword)
        {
            // Retrieve the user by email
            Users userDb = await _userRepository.GetByEmailAsync(email);

            if (userDb == null)
                throw new Exception("User not found.");

            // If the old password is provided, verify it
            if (!string.IsNullOrEmpty(oldPassword))
            {
                // Hash the old password using MD5
                MD5CryptoServiceProvider mD5CryptoServiceProvider = new MD5CryptoServiceProvider();
                byte[] oldPasswordBytes = Encoding.ASCII.GetBytes(oldPassword);
                byte[] oldHashBytes = mD5CryptoServiceProvider.ComputeHash(oldPasswordBytes);
                string oldHash = Encoding.ASCII.GetString(oldHashBytes);

                // Check if the old password matches the one in the database
                if (userDb.Password != oldHash)
                    throw new Exception("The old password is incorrect.");
            }

            // Hash the new password using MD5
            MD5CryptoServiceProvider newMD5CryptoServiceProvider = new MD5CryptoServiceProvider();
            byte[] newPasswordBytes = Encoding.ASCII.GetBytes(newPassword);
            byte[] newHashBytes = newMD5CryptoServiceProvider.ComputeHash(newPasswordBytes);
            string newHash = Encoding.ASCII.GetString(newHashBytes);

            // Update the user's password
            userDb.Password = newHash;

            // Save changes
            await _userRepository.UpdateAsync(userDb);
        }

        public async Task DeleteUserAsync(int id)
        {
            await _userRepository.DeleteAsync(id);
        }
    }
}
