namespace MojPrevoz.Services.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using MojPrevoz.DataAccess.DataContext;
    using MojPrevoz.DataAccess.Interfaces;
    using MojPrevoz.DomainModels.Models;
    using MojPrevoz.DTOs.PostsDTOs;
    using MojPrevoz.DTOs.SavedPostsDTOs;
    using MojPrevoz.Mappers;
    using MojPrevoz.Services.Interfaces;
    public class PostsService : IPostsService
    {
        private readonly IPostsRepository _postsRepository;
        public readonly MojPrevozDbContext _dbContext;

        public PostsService(IPostsRepository _postsRepository, MojPrevozDbContext _dbContext)
        {
            this._postsRepository = _postsRepository;
            this._dbContext = _dbContext;
        }

        public async Task<List<PostsDTO>> GetAllPostsAsync(int skip, int take)
        {
            var postsDb = await _dbContext.Posts
                                           .Include(x => x.User) // Include User information
                                            .ThenInclude(x => x.SavedPosts)
                                           .OrderByDescending(p => p.CreatedDate)
                                           .Skip(skip)
                                           .Take(take)
                                           .ToListAsync();

            if (postsDb == null || !postsDb.Any())
                throw new Exception("No posts found.");

            // Fetch all saved user IDs for the posts in one go
            var savedPosts = await _dbContext.SavedPosts
                                              .Where(sp => postsDb.Select(p => p.Id).Contains(sp.PostId))
                                              .ToListAsync();

            // Create a dictionary to map PostId to list of UserIds who saved the post
            var savedUserIdsMap = savedPosts
                .GroupBy(sp => sp.PostId)
                .ToDictionary(g => g.Key, g => g.Select(sp => sp.UserId).ToList());

            // Transform posts to DTOs and populate SavedByUserIds
            var postsDto = postsDb.Select(p =>
            {
                var postDto = p.ToPostsDTO();
                postDto.SavedByUserIds = savedUserIdsMap.ContainsKey(p.Id)
                    ? savedUserIdsMap[p.Id]
                    : new List<int>(); // Set to empty list if no user has saved the post

                return postDto;
            }).ToList();

            return postsDto;
        }

        public async Task<List<PostsDTO>> GetPostsByUserIdAsync(int userId, int? skip, int? take)
        {
            // Get list of blocked users for the given userId
            var blockedUsers = await _dbContext.BlockedUsers
                                        .Where(bu => bu.BlockingUserId == userId || bu.BlockedUserId == userId)
                                        .Select(bu => bu.BlockingUserId == userId ? bu.BlockedUserId : bu.BlockingUserId)
                                        .Distinct()
                                        .ToListAsync();

            // Retrieve posts excluding posts from blocked users
            var query = (IQueryable<Posts>)_dbContext.Posts
                                  .Include(p => p.User) // Include user data
                                  .Where(p => !blockedUsers.Contains(p.UserId))
                                  .OrderByDescending(p => p.CreatedDate);

            // Apply skip and take if provided
            if (skip.HasValue && take.HasValue)
                query = query.Skip(skip.Value).Take(take.Value);

            var postsDb = await query.ToListAsync();

            if (!postsDb.Any())
                return new List<PostsDTO>();

            // Get saved posts for the retrieved posts
            var savedPosts = await _dbContext.SavedPosts
                                              .Where(sp => postsDb.Select(p => p.Id).Contains(sp.PostId))
                                              .ToListAsync();

            // Map PostId to the list of UserIds who saved the post
            var savedUserIdsMap = savedPosts
                .GroupBy(sp => sp.PostId)
                .ToDictionary(g => g.Key, g => g.Select(sp => sp.UserId).ToList());

            // Transform posts to DTOs and include SavedByUserIds
            var postsDto = postsDb.Select(p =>
            {
                var postDto = p.ToPostsDTO();
                postDto.SavedByUserIds = savedUserIdsMap.TryGetValue(p.Id, out var userIds)
                    ? userIds
                    : new List<int>(); // Assign empty list if no users saved the post

                return postDto;
            }).ToList();

            return postsDto;
        }

        public async Task<PostsDTO> GetPostAsync(int id)
        {
            Posts postsDb = await _postsRepository.GetByIdAsync(id);

            if (postsDb == null)
                throw new Exception("Contact the support team");

            return postsDb.ToPostsDTO();
        }

        public async Task CreatePostAsync(CreatePostDTO createPostDTO)
        {
            Posts postsDb = createPostDTO.ToPosts();
            await _postsRepository.CreateAsync(postsDb);
        }

        public async Task EditPostAsync(EditPostDTO editPostDTO)
        {
            Posts postsDb = await _postsRepository.GetByIdAsync(editPostDTO.Id);

            if (postsDb == null)
                throw new Exception("The post cannot be found");

            postsDb.StartingLocation = editPostDTO.StartingLocation;
            postsDb.EndLocation = editPostDTO.EndLocation;
            postsDb.Time = editPostDTO.Time;
            postsDb.Date = editPostDTO.Date;
            postsDb.Price = editPostDTO.Price;
            postsDb.PhoneNumber = editPostDTO.PhoneNumber;
            postsDb.PickUpLocation = editPostDTO.PickUpLocation;
            postsDb.StopByLocations = editPostDTO.StopByLocations;
            postsDb.Luggage = editPostDTO.Luggage;
            postsDb.SeatsNeeded = editPostDTO.SeatsNeeded;
            postsDb.SeatsAvailable = editPostDTO.SeatsAvailable;
            postsDb.ShowPrice = editPostDTO.ShowPrice;

            await _postsRepository.UpdateAsync(postsDb);

        }
        public async Task DeletePostAsync(int id)
        {
            await _postsRepository.DeleteAsync(id);
        }

        public async Task SavePostForUserAsync(int userId, int postId)
        {
            var savedPost = new SavedPosts // Assuming you have a SavedPost entity
            {
                UserId = userId,
                PostId = postId
            };

            _dbContext.SavedPosts.Add(savedPost);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<SavedPostsDTO>> GetSavedPostsForUserAsync(int userId)
        {
            var savedPosts = await (from sp in _dbContext.SavedPosts
                                    join p in _dbContext.Posts on sp.PostId equals p.Id
                                    where sp.UserId == userId
                                    select new SavedPostsDTO
                                    {
                                        Id = p.Id,
                                        StartingLocation = p.StartingLocation,
                                        EndLocation = p.EndLocation,
                                        UserId = p.UserId,
                                        FirstName = p.User.FirstName, // Make sure to include User in your select if needed
                                        LastName = p.User.LastName, // Make sure to include User in your select if needed
                                        ImageUri = p.User.ImageUri, // Make sure to include User in your select if needed
                                        Time = p.Time,
                                        Date = p.Date,
                                        Type = p.Type.ToString(),
                                        Price = p.Price,
                                        PickUpLocation = p.PickUpLocation,
                                        StopByLocations = p.StopByLocations,
                                        PhoneNumber = p.PhoneNumber,
                                        Luggage = p.Luggage,
                                        CreatedDate = p.CreatedDate,
                                        SeatsNeeded = p.SeatsNeeded,
                                        SeatsAvailable = p.SeatsAvailable,
                                        ShowPrice = p.ShowPrice,
                                        SavedByUserIds = _dbContext.SavedPosts
                                            .Where(s => s.PostId == p.Id)
                                            .Select(s => s.UserId)
                                            .ToList() // Convert to a list of User IDs
                                    })
                                    .ToListAsync();

            return savedPosts;
        }

        public async Task RemovePostForUserAsync(int userId, int postId)
        {
            var savedPost = await _dbContext.SavedPosts
                .FirstOrDefaultAsync(sp => sp.UserId == userId && sp.PostId == postId);

            if (savedPost != null)
            {
                _dbContext.SavedPosts.Remove(savedPost);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                throw new Exception("Saved post not found.");
            }
        }

        public async Task<List<PostsDTO>> GetAllPostsForSingleUserAsync(int userId)
        {
            // Fetch all posts for the given user with pagination (skip and take)
            var posts = await _dbContext.Posts
                .Include(x => x.User)
                .Where(p => p.UserId == userId) // Filter posts by userId
                .OrderByDescending(p => p.CreatedDate) // Assuming you want to order by date (descending)
                .ToListAsync();

            // Convert posts to PostsDTO (map entity to DTO)
            var postsDto = posts.Select(p => p.ToPostsDTO()).ToList();

            return postsDto;
        }

    }
}
