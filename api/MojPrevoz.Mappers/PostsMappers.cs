namespace MojPrevoz.Mappers
{
    using MojPrevoz.DomainModels.Enums;
    using MojPrevoz.DomainModels.Models;
    using MojPrevoz.DTOs.PostsDTOs;

    public static class PostsMappers
    {
        public static PostsDTO ToPostsDTO(this Posts posts)
        {
            return new PostsDTO()
            {
                Id = posts.Id,
                Date = posts.Date,
                EndLocation = posts.EndLocation,
                Luggage = posts.Luggage,
                PickUpLocation = posts.PickUpLocation,
                PhoneNumber = posts.PhoneNumber,
                Price = posts.Price,
                SeatsAvailable = posts.SeatsAvailable,
                SeatsNeeded = posts.SeatsNeeded,
                ShowPrice = posts.ShowPrice,
                StartingLocation = posts.StartingLocation,
                CreatedDate = posts.CreatedDate,
                StopByLocations = posts.StopByLocations,
                Time = posts.Time,
                Type = posts.Type.ToString(),
                UserId = posts.UserId,
                FirstName = posts.User.FirstName,
                LastName = posts.User.LastName,
                ImageUri = posts.User.ImageUri
            };
        }

        public static Posts ToPosts(this CreatePostDTO createPostDTO)
        {
            if (!Enum.TryParse<UserRole>(createPostDTO.Type, true, out var userRole))
                throw new ArgumentException($"Invalid UserType value: {createPostDTO.Type}", nameof(createPostDTO.Type));

            return new Posts()
            {
                Date = createPostDTO.Date,
                EndLocation = createPostDTO.EndLocation,
                Luggage = createPostDTO.Luggage,
                PhoneNumber = createPostDTO.PhoneNumber,
                PickUpLocation = createPostDTO.PickUpLocation,
                Price = createPostDTO.Price,
                SeatsAvailable = createPostDTO.SeatsAvailable,
                SeatsNeeded = createPostDTO.SeatsNeeded,
                ShowPrice = createPostDTO.ShowPrice,
                StartingLocation = createPostDTO.StartingLocation,
                StopByLocations = createPostDTO.StopByLocations,
                CreatedDate = DateTime.Now,
                Time = createPostDTO.Time,
                Type = userRole,
                UserId = createPostDTO.UserId
            };
        }
    }
}
