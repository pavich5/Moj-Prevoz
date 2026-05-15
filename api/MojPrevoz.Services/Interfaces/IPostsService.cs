namespace MojPrevoz.Services.Interfaces
{
    using MojPrevoz.DTOs.PostsDTOs;
    using MojPrevoz.DTOs.SavedPostsDTOs;

    public interface IPostsService
    {
        Task<List<PostsDTO>> GetAllPostsAsync(int skip, int take);
        Task<List<PostsDTO>> GetAllPostsForSingleUserAsync(int userId);
        Task<PostsDTO> GetPostAsync(int id);
        Task CreatePostAsync(CreatePostDTO createPostDTO);
        Task<List<SavedPostsDTO>> GetSavedPostsForUserAsync(int userId);
        Task EditPostAsync(EditPostDTO editPostDTO);
        Task SavePostForUserAsync(int userId , int postId);
        Task RemovePostForUserAsync(int userId , int postId);
        Task DeletePostAsync(int id);
        //Task<List<PostsDTO>> GetSavedPostsAsync(int userId);
        Task<List<PostsDTO>> GetPostsByUserIdAsync(int userId, int? skip , int? take);
    }
}