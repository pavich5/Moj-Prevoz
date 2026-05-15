using MojPrevoz.DTOs.ReviewsDTOs;

namespace MojPrevoz.Services.Interfaces
{
    public interface IReviewsService
    {
        Task<ReviewsResponseDTO> GetAllReviewsAsync(int receiverId, int skip, int take);
        //Task<PostsDTO> GetPostAsync(int id);
        Task CreateReviewAsync(CreateReviewDTO createReviewDTO);
        Task EditReviewAsync(EditReviewDTO editReviewDTO);
        Task DeleteReviewAsync(int id);
    }
}
