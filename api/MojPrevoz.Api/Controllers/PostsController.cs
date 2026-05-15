using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MojPrevoz.DataAccess.DataContext;
using MojPrevoz.DataAccess.Interfaces;
using MojPrevoz.DomainModels.Enums;
using MojPrevoz.DTOs.MailDTOs;
using MojPrevoz.DTOs.PostsDTOs;
using MojPrevoz.DTOs.SavedPostsDTOs;
using MojPrevoz.Helpers;
using MojPrevoz.Services.Interfaces;

namespace MojPrevoz.Controllers
{
    [PrivateKeyAuthorize]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IPostsService _postsService;
        private readonly IPostsRepository _postsRepository;
        private readonly IMailService _mailService;
        private readonly MojPrevozDbContext _dbContext;

        public PostsController(IPostsService _postsService, MojPrevozDbContext _dbContext, IPostsRepository _postsRepository, IMailService _mailService)
        {
            this._postsService = _postsService;
            this._postsRepository = _postsRepository;
            this._dbContext = _dbContext;
            this._mailService = _mailService;
        }

        [HttpGet]
        public async Task<ActionResult<List<PostsDTO>>> GetAll(int? userId = null, int skip = 0, int take = 10)
        {
            if (take <= 0)
                return BadRequest("Invalid pagination parameters.");

            var userPosts = await _postsService.GetPostsByUserIdAsync(userId.Value, skip, take);
            if (!userPosts.Any())
                return NotFound("No posts available for the specified user.");
            return Ok(userPosts);

            //var posts = await _postsService.GetAllPostsAsync(skip, take);
            //if (!posts.Any())
            //    return NotFound("No posts available.");

            //return Ok(posts);
        }

        [HttpGet("get-posts-for-user")]
        public async Task<ActionResult<List<PostsDTO>>> GetAllPostsForSingleUser(int? userId = null)
        {
            var userPosts = await _postsService.GetAllPostsForSingleUserAsync(userId.Value);

            if (!userPosts.Any())
                return new List<PostsDTO>();

            return Ok(userPosts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PostsDTO>> GetPost(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid input for ID.");

            var postDTO = await _postsService.GetPostAsync(id);

            if (postDTO == null)
                return NotFound($"Post with ID {id} not found.");

            return Ok(postDTO);
        }

        [HttpGet("saved-posts")]
        public async Task<IActionResult> GetSavedPosts(int userId)
        {
            if (userId <= 0)
                return BadRequest("Invalid user ID.");

            var savedPosts = await _postsService.GetSavedPostsForUserAsync(userId);

            if (!savedPosts.Any())
                return NotFound("No saved posts available for this user.");

            return Ok(savedPosts);
        }


        [HttpGet("search")]
        public async Task<ActionResult<List<PostsDTO>>> SearchPosts(string? time, int loggedUserId, int? seats, string? startingLocation, string? endLocation, UserRole? type, string? startDate, string? endDate)
        {
            List<PostsDTO> query = await _postsService.GetPostsByUserIdAsync(loggedUserId, null, null);

            // Filter by Time
            if (!string.IsNullOrEmpty(time))
                query = query.Where(p => p.Time == time).ToList();

            // Filter by Seats
            if (seats.HasValue)
            {
                if (seats.Value == 5)
                {
                    query = query.Where(p => p.SeatsAvailable >= 5 || p.SeatsNeeded >= 5).ToList();
                }
                else
                {
                    query = query.Where(p => p.SeatsAvailable == seats.Value || p.SeatsNeeded == seats.Value).ToList();
                }
            }

            // Filter by Starting and Ending Location
            if (!string.IsNullOrEmpty(startingLocation))
            {
                query = query.Where(p =>
                    p.StartingLocation == startingLocation ||
                    (!string.IsNullOrEmpty(p.StopByLocations) &&
                     p.StopByLocations.Split(',').Select(loc => loc.Trim()).Contains(startingLocation))
                ).ToList();
            }

            if (!string.IsNullOrEmpty(endLocation))
            {
                query = query.Where(p => p.EndLocation == endLocation).ToList();
            }

            // Filter by UserRole
            if (type.HasValue)
                query = query.Where(p => Enum.TryParse(p.Type, out UserRole parsedType) && parsedType == type.Value).ToList();

            // Initialize start and end date variables
            DateTime parsedStartDate = DateTime.MinValue;
            DateTime parsedEndDate = DateTime.MaxValue;

            // Filter by Date Range (startDate and endDate)
            bool isStartDateValid = !string.IsNullOrEmpty(startDate) && DateTime.TryParseExact(startDate, "dd.MM.yyyy", null, System.Globalization.DateTimeStyles.None, out parsedStartDate);
            bool isEndDateValid = !string.IsNullOrEmpty(endDate) && DateTime.TryParseExact(endDate, "dd.MM.yyyy", null, System.Globalization.DateTimeStyles.None, out parsedEndDate);

            if (isStartDateValid)
            {
                if (isEndDateValid)
                {
                    query = query.Where(p =>
                        DateTime.TryParseExact(p.Date, "dd.MM.yyyy", null, System.Globalization.DateTimeStyles.None, out var postDate) &&
                        postDate >= parsedStartDate && postDate <= parsedEndDate
                    ).ToList();
                }
                else
                {
                    query = query.Where(p =>
                        DateTime.TryParseExact(p.Date, "dd.MM.yyyy", null, System.Globalization.DateTimeStyles.None, out var postDate) &&
                        postDate >= parsedStartDate
                    ).ToList();
                }
            }
            else if (!string.IsNullOrEmpty(startDate) || !string.IsNullOrEmpty(endDate))
            {
                return BadRequest("Invalid date format for startDate or endDate. Please use the format dd.MM.yyyy.");
            }

            // Return results
            if (query.Any())
            {
                var postsDTO = query
                    .OrderByDescending(x => x.CreatedDate)
                    .ToList();
                return Ok(postsDTO);
            }
            else
            {
                return NotFound("No posts match the search criteria.");
            }
        }

        [HttpPost("report-post")]
        public async Task<IActionResult> ReportPost([FromBody] ReportPostDTO reportPostDto)
        {
            var user = _dbContext.Users.FirstOrDefault(x => x.Id == reportPostDto.UserId);
            if (reportPostDto == null ||
                (reportPostDto.UserId < 0) ||
                (reportPostDto.PostId < 0) ||
                string.IsNullOrEmpty(reportPostDto.ReportReason))
            {
                return BadRequest("All fields are required.");
            }

            // Prepare email data
            var emailBody = $@"
<div style='font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;'>
    <h2 style='color: #d32f2f; text-align: center;'>Post Report Notification</h2>
    <p style='font-size: 16px; color: #333; line-height: 1.6;'>
        A post has been reported on your platform. Below are the details of the report:
    </p>
    <table style='width: 100%; border-collapse: collapse; margin: 20px 0;'>
        <tr>
            <td style='font-size: 16px; color: #555; font-weight: bold; padding: 10px; border-bottom: 1px solid #e0e0e0;'>Reporter Name:</td>
            <td style='font-size: 16px; color: #333; padding: 10px; border-bottom: 1px solid #e0e0e0;'>{user.FirstName} {user.LastName}</td>
        </tr>
        <tr>
            <td style='font-size: 16px; color: #555; font-weight: bold; padding: 10px; border-bottom: 1px solid #e0e0e0;'>Reporter Email:</td>
            <td style='font-size: 16px; color: #333; padding: 10px; border-bottom: 1px solid #e0e0e0;'>{user.Email}</td>
        </tr>
        <tr>
            <td style='font-size: 16px; color: #555; font-weight: bold; padding: 10px; border-bottom: 1px solid #e0e0e0;'>Post ID:</td>
            <td style='font-size: 16px; color: #333; padding: 10px; border-bottom: 1px solid #e0e0e0;'>{reportPostDto.PostId}</td>
        </tr>
        <tr>
            <td style='font-size: 16px; color: #555; font-weight: bold; padding: 10px;'>Reason for Report:</td>
            <td style='font-size: 16px; color: #333; padding: 10px;'>{reportPostDto.ReportReason}</td>
        </tr>
    </table>
    <p style='font-size: 14px; color: #999; text-align: center; margin-top: 20px;'>
        This is an automated message. Please do not reply.
    </p>
</div>";


            var mailData = new MailDTO
            {
                EmailToId = "novoselskiantonio@gmail.com", // Primary recipient
                EmailToName = "Antonio Novoselski", // Name of primary recipient
                EmailSubject = "Post Report Notification",
                FullName = "Admin", // Placeholder for sender's full name
            };

            // Send the email to both addresses
            var emailSent = await _mailService.SendReportEmailAsync(mailData, emailBody, "antoniopavic.dev@gmail.com");

            if (!emailSent)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to send the report email.");
            }

            return Ok("Report has been successfully submitted.");
        }

        [HttpPost]
        public async Task<ActionResult> CreatePost([FromBody] CreatePostDTO createPostDTO)
        {
            if (createPostDTO == null)
                return BadRequest("The post can not be null");

            if (string.IsNullOrEmpty(createPostDTO.StartingLocation) ||
                string.IsNullOrEmpty(createPostDTO.EndLocation) ||
                createPostDTO.UserId <= 0 ||
                string.IsNullOrEmpty(createPostDTO.Time) ||
                string.IsNullOrEmpty(createPostDTO.Date) ||
                string.IsNullOrEmpty(createPostDTO.Type) ||
                (createPostDTO.Price <= 0))
            {
                return BadRequest("You need to enter all required parameters.");
            }

            if (createPostDTO.Type == "passenger" &&
                (createPostDTO.SeatsNeeded == null || string.IsNullOrEmpty(createPostDTO.Luggage)))
                return BadRequest("Provide required details for a passenger.");

            if (createPostDTO.Type == "driver" &&
                (createPostDTO.SeatsAvailable == null ||
                 string.IsNullOrEmpty(createPostDTO.PickUpLocation) ||
                 string.IsNullOrEmpty(createPostDTO.StopByLocations)))
            {
                return BadRequest("Provide required details for a driver.");
            }

            await _postsService.CreatePostAsync(createPostDTO);
            return StatusCode(StatusCodes.Status201Created, "Post created successfully.");
        }

        [HttpPatch]
        public async Task<IActionResult> EditPost([FromBody] EditPostDTO editPostDTO)
        {
            if (editPostDTO == null)
                return BadRequest("Invalid input.");

            if (editPostDTO.Id <= 0)
                return BadRequest("Invalid ID. Please try again.");

            await _postsService.EditPostAsync(editPostDTO);
            return Ok("Post updated successfully.");
        }

        [HttpPost("save-post")]
        public async Task<IActionResult> SavePost([FromBody] SavePostDTO savePostDTO)
        {
            if (savePostDTO == null || savePostDTO.UserId <= 0 || savePostDTO.PostId <= 0)
                return BadRequest("Invalid input.");

            await _postsService.SavePostForUserAsync(savePostDTO.UserId, savePostDTO.PostId);
            return Ok("Post saved successfully.");
        }

        [HttpPost("remove-post")]
        public async Task<IActionResult> RemovePost([FromBody] SavePostDTO removePostDTO)
        {
            if (removePostDTO == null || removePostDTO.UserId <= 0 || removePostDTO.PostId <= 0)
                return BadRequest("Invalid input.");

            await _postsService.RemovePostForUserAsync(removePostDTO.UserId, removePostDTO.PostId);
            return Ok("Post removed successfully.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid input for id.");

            PostsDTO postsDTO = await _postsService.GetPostAsync(id);

            if (postsDTO == null)
                return NotFound("Post not found.");

            await _postsService.DeletePostAsync(postsDTO.Id);
            return Ok("Post deleted successfully.");
        }
    }
}
