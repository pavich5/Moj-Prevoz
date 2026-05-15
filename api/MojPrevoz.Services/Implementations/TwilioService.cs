using Twilio.Types;
using Twilio;
using MojPrevoz.Services.Interfaces;
using Microsoft.Extensions.Options;
using MojPrevoz.DTOs;
using Twilio.Rest.Api.V2010.Account;

namespace MojPrevoz.Services.Implementations
{
    public class TwilioService : ITwilioService
    {
        private readonly TwilioSettings _twilioSettings;
        public TwilioService(IOptions<TwilioSettings> twilioSettings)
        {
            _twilioSettings = twilioSettings.Value;

            // Initialize Twilio with your Account SID and Auth Token
            TwilioClient.Init(_twilioSettings.AccountSID, _twilioSettings.AuthToken);
        }

        public async Task SendMessageAsync(string to, string code)
        {
            var messageOptions = new CreateMessageOptions(new PhoneNumber(to))
            {
                
                From = new PhoneNumber(_twilioSettings.PhoneNumber),
                Body = $"Your verification code for Moj Prevoz - {code}."
            };

            var msg = await MessageResource.CreateAsync(messageOptions);
        }
    }
}
