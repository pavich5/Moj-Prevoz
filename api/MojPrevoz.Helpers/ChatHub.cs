
using Microsoft.AspNetCore.SignalR;
using MojPrevoz.DataAccess.DataContext;
using MojPrevoz.DomainModels.Enums;
using MojPrevoz.DomainModels.Models;

namespace MojPrevoz.Helpers
{
    public class ChatHub : Hub
    {
        private readonly MojPrevozDbContext _dbContext;

        public ChatHub(MojPrevozDbContext _dbContext)
        {
            this._dbContext = _dbContext;
        }

        //public async Task SendMessage(string senderId, string receiverId, string message)
        //{
        //    // Get the sender's ID directly from the parameter
        //    if (string.IsNullOrEmpty(senderId))
        //        throw new HubException("Sender ID is required!");

        //    // Initialize the message entity with the required fields
        //    var messageEntity = new Messages
        //    {
        //        SenderId = int.Parse(senderId),
        //        ReceiverId = int.Parse(receiverId), // Assuming receiverId is a string representation of an integer
        //        Message = message,
        //        Date = DateTime.Now.ToString("dd.MM.yyyy"),
        //        MessageStatus = MessageStatus.Failed // Initially set to Failed
        //    };

        //    try
        //    {
        //        // Save the message to the database
        //        _dbContext.Messages.Add(messageEntity);
        //        await _dbContext.SaveChangesAsync();

        //        // Send the message to the receiver via SignalR
        //        await Clients.User(receiverId).SendAsync("ReceiveMessage", senderId, message);

        //        // Update message status to Delivered if the sending was successful
        //        messageEntity.MessageStatus = MessageStatus.Delivered;
        //    }
        //    catch (Exception ex)
        //    {
        //        // Log the exception (optional)
        //        Console.WriteLine($"Error while sending message: {ex.Message}");

        //        // If error occurs, the status remains as Failed
        //        messageEntity.MessageStatus = MessageStatus.Failed;
        //    }
        //    finally
        //    {
        //        // Ensure that the updated status is saved
        //        await _dbContext.SaveChangesAsync();
        //    }
        //}

        public async Task NewMessage(int senderId, int receiverId, string message) =>
            await Clients.All.SendAsync("messageReceived", senderId, receiverId, message);
    }
}
