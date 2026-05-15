
namespace MojPrevoz.Services.Interfaces
{
    using MojPrevoz.DTOs.MailDTOs;
    public interface IMailService
    {
        Task<bool> SendMailAsync(MailDTO mailData);
        Task<bool> SendForgotPasswordMailAsync(MailDTO mailData);
        Task<bool> SendWelcomeEmailAsync(MailDTO mailData);
        Task<bool> SendReportEmailAsync(MailDTO mailData, string emailBody, string additionalRecipient);
        Task<bool> SendReportUserEmailAsync(MailDTO mailData, string emailBody, string additionalRecipient);
    }
}
