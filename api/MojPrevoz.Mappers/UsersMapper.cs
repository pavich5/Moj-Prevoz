using Microsoft.EntityFrameworkCore;
using System.Globalization;
using MojPrevoz.DataAccess.DataContext;
using MojPrevoz.DomainModels.Enums;
using MojPrevoz.DomainModels.Models;
using MojPrevoz.DTOs.UsersDTOs;

namespace MojPrevoz.Mappers
{
    public static class UsersMapper
    {
        public static UsersDTO ToUsersDTO(this Users users, MojPrevozDbContext? dbContext = null)
        {
            int age = 0;

            // Define the expected date format
            var format = "dd.MM.yyyy";
            var provider = CultureInfo.InvariantCulture;

            // Try to parse the DateOfBirth string using the exact format
            if (DateTime.TryParseExact(users.DateOfBirth, format, provider, DateTimeStyles.None, out DateTime dateOfBirth))
            {
                // Calculate the age based on the current date and DateOfBirth
                var today = DateTime.Today;
                age = today.Year - dateOfBirth.Year;

                // Adjust the age if the birthday hasn't occurred yet this year
                if (dateOfBirth > today.AddYears(-age))
                    age--;
            }

            // Default to 0 if dbContext is not provided
            int unseenMessageUsersCount = 0;

            if (dbContext != null)
            {
                unseenMessageUsersCount = dbContext.Messages
                .Where(m =>
                    (m.ReceiverId == users.Id || m.SenderId == users.Id) // Logged user is part of the conversation
                    && m.MessageStatus != MessageStatus.Seen) // Message is not seen
                .Select(m => m.ReceiverId == users.Id ? m.SenderId : m.ReceiverId) // Get the other user's ID
                .Distinct() // Ensure each user is counted only once
                .Count();
            }

            return new UsersDTO()
            {
                Id = users.Id,
                Email = users.Email,
                FirstName = users.FirstName,
                ImageUri = users.ImageUri,
                JoinedDate = users.JoinedDate,
                LastName = users.LastName,
                NewMessagesCount = unseenMessageUsersCount,
                Password = users.Password,
                IsThemeWhite = users.IsThemeWhite,
                PhoneNumber = users.PhoneNumber,
                Age = age  // Add the calculated age to the DTO
            };
        }


        public static Users ToUsers(this CreateUserDTO createUserDTO)
        {

            return new Users()
            {
               Email = createUserDTO.Email,
               FirstName = createUserDTO.FirstName,
               Password = createUserDTO.Password,
               ImageUri = createUserDTO.ImageUri,
               JoinedDate = createUserDTO.JoinedDate,
               LastName = createUserDTO.LastName,
               DateOfBirth = createUserDTO.DateOfBirth,
               PhoneNumber = createUserDTO.PhoneNumber
            };
        }
    }
}
