using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Twilio.TwiML.Voice;
using MojPrevoz.DataAccess.DataContext;
using MojPrevoz.DomainModels.Enums;
using MojPrevoz.Helpers;
using MojPrevoz.Services.Interfaces;

namespace MojPrevoz.Controllers
{
    [PrivateKeyAuthorize]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        //private readonly IHubContext<ChatHub> _hubContext;
        private readonly MojPrevozDbContext _dbContext;
        private readonly IUsersService _userService;

        public MessagesController(MojPrevozDbContext _dbContext, IUsersService _userService)
        {
            this._dbContext = _dbContext;
            this._userService = _userService;
        }

        [HttpGet("user-messages")]
        public async Task<IActionResult> GetUserMessages(int loggedUserId)
        {
            try
            {
                // Fetch the messages including sender and receiver details
                var rawMessages = await _dbContext.Messages
                    .Include(m => m.Sender)
                    .Include(m => m.Receiver)
                    .Where(m =>
                (m.SenderId == loggedUserId || m.ReceiverId == loggedUserId) &&
                !_dbContext.BlockedUsers.Any(b =>
                    (b.BlockingUserId == m.SenderId && b.BlockedUserId == m.ReceiverId) || 
                    (b.BlockingUserId == m.ReceiverId && b.BlockedUserId == m.SenderId)    
                ))
                    .ToListAsync();

                // Perform grouping and other operations in memory
                var lastMessages = rawMessages
                    .GroupBy(m => new
                    {
                        // Normalize the pair by ensuring sender is always less than receiver
                        SenderId = m.SenderId < m.ReceiverId ? m.SenderId : m.ReceiverId,
                        ReceiverId = m.SenderId < m.ReceiverId ? m.ReceiverId : m.SenderId
                    })
                    .Select(g =>
                    {
                        // Get the most recent message in the group
                        var lastMessage = g.OrderByDescending(m => m.Date).FirstOrDefault();

                        // Identify the counterpart user (not the logged user)
                        var otherUser = lastMessage.SenderId == loggedUserId
                            ? lastMessage.Receiver
                            : lastMessage.Sender;

                        return new
                        {
                            Id = otherUser?.Id, // ID of the other user
                            Name = otherUser != null ? otherUser.FirstName + " " + otherUser.LastName : null,
                            Image = otherUser?.ImageUri,
                            LastMessage = lastMessage?.Message,
                            LastMessageTime = lastMessage?.Date.ToString(),
                            NewMessagesCount = g.Count(m => m.MessageStatus != MessageStatus.Seen && m.ReceiverId == loggedUserId)
                        };
                    })
                    .Where(m => m.Id != null) // Filter out any invalid results
                .ToList();

                lastMessages.Reverse();
                
                return Ok(lastMessages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("conversation")]
        public async Task<IActionResult> GetConversation(int senderId, int receiverId, int skip = 0, int take = 15)
        {
            try
            {
                // Get the total count of messages between sender and receiver
                var totalMessages = await _dbContext.Messages
                    .Where(m => (m.SenderId == senderId && m.ReceiverId == receiverId) ||
                                (m.SenderId == receiverId && m.ReceiverId == senderId))
                    .CountAsync();

                // If skip exceeds or equals the total number of messages, return no messages
                if (skip >= totalMessages)
                {
                    return Ok(new List<string>()); // No messages to return
                }

                // Update message statuses to "Seen"
                var unseenMessages = await _dbContext.Messages
                    .Where(m =>
                        ((m.SenderId == senderId && m.ReceiverId == receiverId) ||
                         (m.SenderId == receiverId && m.ReceiverId == senderId)) &&
                         m.MessageStatus != MessageStatus.Seen)
                    .ToListAsync();

                // Mark messages as seen
                unseenMessages.ForEach(m => m.MessageStatus = MessageStatus.Seen);

                // Save changes to the database
                await _dbContext.SaveChangesAsync();

                // Query to get messages between the sender and receiver with pagination
                var conversation = await _dbContext.Messages
                    .Include(m => m.Sender)
                    .Include(m => m.Receiver)
                    .Where(m => (m.SenderId == senderId && m.ReceiverId == receiverId) ||
                                (m.SenderId == receiverId && m.ReceiverId == senderId))
                    .OrderByDescending(m => m.Date)
                    .Skip(skip) // Skipping the first 'skip' number of messages
                    .Take(take) // Taking up to 'take' number of messages
                    .Select(m => new
                    {
                        id = m.Id,
                        sender = m.Sender.FirstName + " " + m.Sender.LastName,
                        message = m.Message,
                        image = m.Sender.ImageUri,
                        date = m.Date,
                        messageStatus = m.MessageStatus,
                        senderId = m.SenderId.ToString()
                    })
                    .ToListAsync();

                if (!conversation.Any())
                    return Ok(new List<string>()); // If no messages, return an empty list

                // Reverse the conversation order to show newest at the bottom
                conversation.Reverse();

                // Return the conversation with the requested page of messages
                return Ok(conversation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
