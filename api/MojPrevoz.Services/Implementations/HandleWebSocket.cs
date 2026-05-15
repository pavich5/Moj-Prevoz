using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;
using MojPrevoz.DataAccess.DataContext;
using MojPrevoz.DomainModels.Enums;
using MojPrevoz.DomainModels.Models;
using MojPrevoz.Services.Implementations;

public class HandleWebSocket
{
    private readonly MojPrevozDbContext _dbContext;
    private readonly ExpoSdkNotifications _expoSdkNotifications;

    // Store all active WebSocket connections
    private static readonly ConcurrentDictionary<string, WebSocket> _connectedClients = new();

    public HandleWebSocket(MojPrevozDbContext dbContext, ExpoSdkNotifications expoSdkNotifications)
    {
        _dbContext = dbContext;
        _expoSdkNotifications = expoSdkNotifications;
    }

    public async Task HandleWebSocketAsync(WebSocket webSocket)
    {
        var buffer = new byte[1024 * 4];
        string clientId = Guid.NewGuid().ToString();

        // Add the WebSocket connection to the list
        _connectedClients.TryAdd(clientId, webSocket);

        try
        {
            while (webSocket.State == WebSocketState.Open)
            {
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Text)
                {
                    var message = Encoding.UTF8.GetString(buffer, 0, result.Count);

                    try
                    {
                        // Parse the incoming message to determine the action
                        var incomingData = JsonConvert.DeserializeObject<dynamic>(message);
                        string actionType = incomingData?.action;

                        if (actionType == "new_message")
                        {
                            await HandleNewMessageAsync(incomingData);
                        }
                        else if (actionType == "delete_message")
                        {
                            await HandleDeleteMessageAsync(incomingData);
                        }
                    }
                    catch (Exception ex)
                    {
                        var errorResponse = Encoding.UTF8.GetBytes($"Error: {ex.Message}");
                        await webSocket.SendAsync(new ArraySegment<byte>(errorResponse), WebSocketMessageType.Text, true, CancellationToken.None);
                    }
                }
                else if (result.MessageType == WebSocketMessageType.Close)
                {
                    break;
                }
            }
        }
        finally
        {
            _connectedClients.TryRemove(clientId, out _);
            if (webSocket.State == WebSocketState.Open)
            {
                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
            }
        }
    }

    private async Task HandleNewMessageAsync(dynamic incomingData)
    {
        // Extract and save the message data
        var newMessage = new Messages
        {
            SenderId = int.Parse((string)incomingData.senderId),
            ReceiverId = int.Parse((string)incomingData.receiverId),
            Message = (string)incomingData.message,
            MessageStatus = MessageStatus.Delivered,
            Date = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")
        };

        _dbContext.Messages.Add(newMessage);
        await _dbContext.SaveChangesAsync();

        // Reload the message with Sender details
        newMessage = await _dbContext.Messages
            .Include(m => m.Sender)
            .FirstOrDefaultAsync(m => m.Id == newMessage.Id);

        // Fetch the Receiver's Expo Push Token
        var receiver = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Id == newMessage.ReceiverId);

        var sender = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Id == newMessage.SenderId);

        var senderFullName = $"{sender.FirstName} {sender.LastName}";

        if (receiver != null && !string.IsNullOrEmpty(receiver.NotificationToken))
        {
            // Send the push notification to the receiver
            await _expoSdkNotifications.SendPushNotificationAsync(receiver.NotificationToken, newMessage.Message, senderFullName);
        }

        // Prepare and broadcast the message
        var response = new
        {
            action = "new_message",
            id = newMessage.Id.ToString(),
            sender = $"{newMessage.Sender.FirstName} {newMessage.Sender.LastName}",
            message = newMessage.Message,
            image = newMessage.Sender.ImageUri ?? string.Empty,
            messageStatus = newMessage.MessageStatus.ToString(),
            senderId = newMessage.SenderId.ToString(),
        };

        await BroadcastMessageAsync(response);
    }

    private async Task HandleDeleteMessageAsync(dynamic incomingData)
    {
        // Extract the message ID
        int messageId = int.Parse((string)incomingData.id);

        // Find and delete the message
        var message = await _dbContext.Messages.FirstOrDefaultAsync(m => m.Id == messageId);
        if (message != null)
        {
            _dbContext.Messages.Remove(message);
            await _dbContext.SaveChangesAsync();

            // Prepare and broadcast the delete event
            var response = new
            {
                action = "delete_message",
                id = messageId
            };

            await BroadcastMessageAsync(response);
        }
    }

    private async Task BroadcastMessageAsync(object message)
    {
        var broadcastMessage = JsonConvert.SerializeObject(message);
        var responseBuffer = Encoding.UTF8.GetBytes(broadcastMessage);

        foreach (var client in _connectedClients.Values)
        {
            if (client.State == WebSocketState.Open)
            {
                await client.SendAsync(new ArraySegment<byte>(responseBuffer), WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }
    }
}
