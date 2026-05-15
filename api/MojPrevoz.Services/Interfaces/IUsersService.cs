using MojPrevoz.DTOs.UsersDTOs;

namespace MojPrevoz.Services.Interfaces
{
    public interface IUsersService
    {
        Task<List<UsersDTO>> GetAllUsersAsync();
        Task<UsersDTO> GetUserAsync(int id);
        Task<UsersDTO> GetUserByEmailAsync(string email); 
        Task CreateUserAsync(CreateUserDTO createUserDTO);
        Task EditUserAsync(EditUserDTO editUserDTO);
        Task<LoginResponseDTO> LoginUserAsync(LoginUserDTO loginUserDto);
        Task UpdatePasswordAsync(string email, string? oldpassword, string newPassword);
        Task DeleteUserAsync(int id);
    }
}
