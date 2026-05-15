using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MojPrevoz.DataAccess.Interfaces;
using MojPrevoz.DomainModels.Models;
using MojPrevoz.DTOs.ReviewsDTOs;
using MojPrevoz.Helpers;
using MojPrevoz.Services.Interfaces;

namespace MojPrevoz.Controllers
{
    [PrivateKeyAuthorize]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewsService _reviewsService;
        private readonly IReviewsRepository _reviewsRepository;

        public ReviewsController(IReviewsService reviewsService, IReviewsRepository _reviewsRepository)
        {
            _reviewsService = reviewsService;
            this._reviewsRepository = _reviewsRepository;
        }

        [HttpGet("{receiverId}")]
        public async Task<ActionResult<ReviewsResponseDTO>> GetAllReviews(int receiverId, int skip, int take)
        {
            var response = await _reviewsService.GetAllReviewsAsync(receiverId, skip, take);

            if (response == null || response.Reviews == null || !response.Reviews.Any())
                return new ReviewsResponseDTO();

            return Ok(response);
        }


        [HttpPost]
        public async Task<ActionResult> CreateReview([FromBody] CreateReviewDTO createReviewDTO)
        {
            await _reviewsService.CreateReviewAsync(createReviewDTO);
            return StatusCode(StatusCodes.Status201Created, "Review created successfully.");
        }

        [HttpPatch]
        public async Task<ActionResult> EditReview([FromBody] EditReviewDTO editReviewDTO)
        {
            await _reviewsService.EditReviewAsync(editReviewDTO);
            return Ok("Review updated successfully.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid input for id");

            Reviews reviews = await _reviewsRepository.GetByIdAsync(id);

            if (reviews == null)
                return NotFound("Review not found!");

            await _reviewsService.DeleteReviewAsync(reviews.Id);

            return Ok("Deleted successfully");
        }
    }
}
