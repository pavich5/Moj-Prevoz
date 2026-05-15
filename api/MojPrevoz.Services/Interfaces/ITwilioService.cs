namespace MojPrevoz.Services.Interfaces
{
    public interface ITwilioService
    {
        Task SendMessageAsync(string to, string message);
    }
}
