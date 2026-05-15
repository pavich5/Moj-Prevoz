using Newtonsoft.Json;
using System.Text;

namespace MojPrevoz.Services.Implementations
{
    public class ExpoSdkNotifications
    {
        private readonly HttpClient _httpClient;

        public ExpoSdkNotifications(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task SendPushNotificationAsync(string expoPushToken, string message, string senderFullName)
        {
            var pushNotificationData = new
            {
                to = expoPushToken,
                sound = "default",
                title = senderFullName,  // Dynamic title for foreground
                body = message,
                // Optionally specify a default title when the app is in the background or the screen is locked
            };

            var json = JsonConvert.SerializeObject(pushNotificationData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://exp.host/--/api/v2/push/send", content);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("Failed to send push notification");
            }
        }
    }
}
