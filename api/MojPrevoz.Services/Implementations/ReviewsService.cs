using Microsoft.EntityFrameworkCore;
using MojPrevoz.DataAccess.DataContext;
using MojPrevoz.DataAccess.Interfaces;
using MojPrevoz.DomainModels.Models;
using MojPrevoz.DTOs.ReviewsDTOs;
using MojPrevoz.Services.Interfaces;

namespace MojPrevoz.Services.Implementations
{
    public class ReviewsService : IReviewsService
    {
        private readonly IReviewsRepository _reviewRepository;
        private readonly MojPrevozDbContext _dbContext;

        public ReviewsService(IReviewsRepository _reviewRepository, MojPrevozDbContext _dbContext)
        {
            this._reviewRepository = _reviewRepository;
            this._dbContext = _dbContext;
        }

        public async Task<ReviewsResponseDTO> GetAllReviewsAsync(int receiverId, int skip, int take)
        {
            // Query reviews for the specified receiverId
            var reviews = await _dbContext.Reviews
                .Include(x => x.Sender)
                .Where(r => r.ReceiverId == receiverId)
                .OrderByDescending(r => r.Date)
                .Skip(skip)
                .Take(take)
                .ToListAsync();

            // Calculate the total number of stars and average rating
            var allReviewsForReceiver = await _dbContext.Reviews
                .Where(r => r.ReceiverId == receiverId)
                .ToListAsync();

            double averageRating = allReviewsForReceiver.Any()
                ? allReviewsForReceiver.Average(r => r.Stars)
                : 0;

            // Map reviews to DTO
            var reviewsDTO = reviews.Select(r => new ReviewsDTO
            {
                Id = r.Id,
                Text = r.Text,
                Stars = r.Stars,
                SenderId = r.SenderId,
                SenderName = $"{r.Sender.FirstName} {r.Sender.LastName}",
                Date = r.Date,
                ImageUri = r.Sender.ImageUri
            }).ToList();

            // Return response with reviews and average rating
            return new ReviewsResponseDTO
            {
                Reviews = reviewsDTO,
                Rating = Math.Round(averageRating, 2) // Round to 2 decimal places for better readability
            };
        }

        public async Task CreateReviewAsync(CreateReviewDTO createReviewDTO)
        {
            var review = new Reviews
            {
                Stars = createReviewDTO.Stars,
                Text = createReviewDTO.Text,
                ReceiverId = createReviewDTO.ReceiverId,
                SenderId = createReviewDTO.SenderId,
                Date = DateTime.Now.ToString("dd.MM.yyyy"),
            };

            // Add the new review to the DbContext
            await _reviewRepository.CreateAsync(review);
        }
        public async Task EditReviewAsync(EditReviewDTO editReviewDTO)
        {
            Reviews reviewsDb = await _reviewRepository.GetByIdAsync(editReviewDTO.Id);

            if (reviewsDb == null)
                throw new Exception("The review cannot be found");

            reviewsDb.Text = editReviewDTO.Text;
            reviewsDb.Stars = editReviewDTO.Stars;


            await _reviewRepository.UpdateAsync(reviewsDb);
        }

        public async Task DeleteReviewAsync(int id)
        {
            await _reviewRepository.DeleteAsync(id);
        }
    }
}
