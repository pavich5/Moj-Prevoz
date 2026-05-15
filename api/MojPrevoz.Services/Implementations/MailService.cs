using MimeKit;
using Microsoft.Extensions.Options;
using MojPrevoz.DTOs.MailDTOs;
using MojPrevoz.Services.Interfaces;

namespace MojPrevoz.Services.Implementations
{
    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;

        public MailService(IOptions<MailSettings> mailSettings)
        {
            _mailSettings = mailSettings.Value;
        }

        public async Task<bool> SendMailAsync(MailDTO mailData)
        {
            try
            {
                var message = new MimeMessage();
                // Use an authorized sender email address
                MailboxAddress emailFrom = new MailboxAddress(_mailSettings.SenderName, _mailSettings.SenderEmail);
                message.From.Add(emailFrom);
                message.To.Add(new MailboxAddress(mailData.EmailToName, mailData.EmailToId));  // Use MailDTO properties
                message.Subject = mailData.EmailSubject;

                // Build the email body with HTML
                var emailBodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                            <div style='font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;'>
                                <h2 style='text-align: center; color: #1a73e8;'>Вашиот код за <strong>Мој Превоз</strong></h2>
                                <p style='font-size: 16px; color: #333; text-align: center;'>
                                    Здраво {mailData.FullName},<br><br>
                                    Користете го кодот за верификација подолу за да ја потврдите вашата идентификација и да ја завршите регистрацијата за <strong>Мој Превоз</strong>.
                                </p>
                                <div style='text-align: center; margin: 20px 0;'>
                                    <span style='font-size: 32px; font-weight: bold; color: #1a73e8; letter-spacing: 4px;'>{mailData.VerifyCode}</span>
                                </div>
                                <p style='font-size: 16px; color: #333; text-align: center;'>
                                    Внесете го овој код во апликацијата <strong>Мој Превоз</strong> за да го потврдите вашиот профил.
                                </p>
                                <p style='font-size: 14px; color: #888; text-align: center;'>
                                    Доколку не го побаравте овој код, ве молиме игнорирајте ја оваа порака.
                                </p>
                                <hr style='border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;'/>
                                <p style='font-size: 14px; color: #999; text-align: center;'>
                                    Ова е автоматска порака. Ве молиме не одговарајте.
                                </p>
                            </div>"

                };

                message.Body = emailBodyBuilder.ToMessageBody();

                // Sending email using MailKit
                using (var mailClient = new MailKit.Net.Smtp.SmtpClient())
                {
                    await mailClient.ConnectAsync(_mailSettings.Server, _mailSettings.Port, MailKit.Security.SecureSocketOptions.Auto);
                    await mailClient.AuthenticateAsync(_mailSettings.Username, _mailSettings.Password);

                    // Send email
                    await mailClient.SendAsync(message);
                    await mailClient.DisconnectAsync(true);
                }

                return true;
            }
            catch (Exception ex)
            {
                // Log the exception (use a logging framework if available)
                Console.WriteLine($"Failed to send email: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendForgotPasswordMailAsync(MailDTO mailData)
        {
            try
            {
                var message = new MimeMessage();
                // Use an authorized sender email address
                MailboxAddress emailFrom = new MailboxAddress(_mailSettings.SenderName, _mailSettings.SenderEmail);
                message.From.Add(emailFrom);
                message.To.Add(new MailboxAddress(mailData.EmailToName, mailData.EmailToId));  // Use MailDTO properties
                message.Subject = mailData.EmailSubject;

                // Build the email body with HTML
                var emailBodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <div style='font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;'>
                            <h2 style='text-align: center; color: #1a73e8;'>Ресетирајте ја вашата лозинка за <strong>Мој Превоз</strong></h2>
                            <p style='font-size: 16px; color: #333; text-align: center;'>
                                Здраво почитуван кориснику,<br><br>
                                Добиено е барање за ресетирање на вашата лозинка за <strong>Мој Превоз</strong>. Користете го кодот за потврда подолу за да ја ресетирате вашата лозинка.
                            </p>
                            <div style='text-align: center; margin: 20px 0;'>
                                <span style='font-size: 32px; font-weight: bold; color: #1a73e8; letter-spacing: 4px;'>{mailData.VerifyCode}</span>
                            </div>
                            <p style='font-size: 16px; color: #333; text-align: center;'>
                                Внесете го овој код во апликацијата <strong>Мој Превоз</strong> за да го завршите процесот на ресетирање на лозинката.
                            </p>
                            <p style='font-size: 14px; color: #888; text-align: center;'>
                                Доколку не побаравте ресетирање на лозинката, ве молиме игнорирајте го овој е-маил.
                            </p>
                            <hr style='border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;'/>
                            <p style='font-size: 14px; color: #999; text-align: center;'>
                                Ова е автоматска порака. Ве молиме не одговарајте.
                            </p>
                        </div>"
                };

                message.Body = emailBodyBuilder.ToMessageBody();

                // Sending email using MailKit
                using (var mailClient = new MailKit.Net.Smtp.SmtpClient())
                {
                    await mailClient.ConnectAsync(_mailSettings.Server, _mailSettings.Port, MailKit.Security.SecureSocketOptions.Auto);
                    await mailClient.AuthenticateAsync(_mailSettings.Username, _mailSettings.Password);

                    // Send email
                    await mailClient.SendAsync(message);
                    await mailClient.DisconnectAsync(true);
                }

                return true;
            }
            catch (Exception ex)
            {
                // Log the exception (use a logging framework if available)
                Console.WriteLine($"Failed to send email: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendWelcomeEmailAsync(MailDTO mailData)
        {
            try
            {
                var message = new MimeMessage();
                MailboxAddress emailFrom = new MailboxAddress("МојПревоз", _mailSettings.SenderEmail);
                message.From.Add(emailFrom);
                message.To.Add(new MailboxAddress(mailData.EmailToName, mailData.EmailToId));
                message.Subject = "Добредојдовте во МојПревоз!";

                var emailBodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
        <div style='font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px; background-color: #f9f9f9;'>
            <h2 style='color: #1a73e8;'>Добредојдовте во <strong>МојПревоз</strong></h2>
            <p style='font-size: 16px; color: #333;'>
                Здраво {mailData.FullName},<br><br>
                Добредојдовте во <strong>МојПревоз</strong> – апликацијата за споделување на превоз низ Македонија која го прави патувањето полесно!
            </p>
            <h3 style='color: #333;'>Што е следно?</h3>
            <ul style='list-style: none; padding-left: 0;'>
                <li><strong>Најди превоз:</strong> Како патник, пребарувај возачи што се движат во твојот правец.</li>
                <li><strong>Понуди превоз:</strong> Како возач, внеси го твоето патување и поврзи се со патници.</li>
                <li><strong>Уживај во патувањето:</strong> Сподели го патувањето, намали ги трошоците и запознај нови луѓе.</li>
            </ul>
            <h3 style='color: #333;'>Зошто МојПревоз?</h3>
            <ul style='list-style: none; padding-left: 0;'>
                <li><strong>Лесен:</strong> Едноставен и брз за користење.</li>
                <li><strong>Прифатлив:</strong> Сподели превоз и намали ги трошоците за патување.</li>
                <li><strong>Заедница:</strong> Поврзи се со локални возачи и патници.</li>
            </ul>
            <p style='font-size: 16px; color: #333;'>
                Драго ни е што си дел од нашата заедница! Ако ти треба помош, слободно контактирај не на <a href='mailto:support@mojprevoz.com'>support@mojprevoz.com</a>.
            </p>
            <hr style='border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;'/>
            <p style='font-size: 14px; color: #999;'>Ова е автоматска порака. Ве молиме не одговарајте.</p>
        </div>"
                };

                message.Body = emailBodyBuilder.ToMessageBody();

                using (var mailClient = new MailKit.Net.Smtp.SmtpClient())
                {
                    await mailClient.ConnectAsync(_mailSettings.Server, _mailSettings.Port, MailKit.Security.SecureSocketOptions.Auto);
                    await mailClient.AuthenticateAsync(_mailSettings.Username, _mailSettings.Password);
                    await mailClient.SendAsync(message);
                    await mailClient.DisconnectAsync(true);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: {ex.Message}");
                return false;
            }
        }
        public async Task<bool> SendReportEmailAsync(MailDTO mailData, string emailBody, string additionalRecipient)
        {
            try
            {
                var message = new MimeMessage();
                MailboxAddress emailFrom = new MailboxAddress("Мој Превоз (No Reply)", _mailSettings.SenderEmail);
                message.From.Add(emailFrom);
                message.To.Add(new MailboxAddress(mailData.EmailToName, mailData.EmailToId));
                message.To.Add(new MailboxAddress("Additional Admin", additionalRecipient));
                message.Subject = mailData.EmailSubject;

                var emailBodyBuilder = new BodyBuilder
                {
                    HtmlBody = emailBody
                };

                message.Body = emailBodyBuilder.ToMessageBody();

                using (var mailClient = new MailKit.Net.Smtp.SmtpClient())
                {
                    await mailClient.ConnectAsync(_mailSettings.Server, _mailSettings.Port, MailKit.Security.SecureSocketOptions.Auto);
                    await mailClient.AuthenticateAsync(_mailSettings.Username, _mailSettings.Password);
                    await mailClient.SendAsync(message);
                    await mailClient.DisconnectAsync(true);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendReportUserEmailAsync(MailDTO mailData, string emailBody, string additionalRecipient)
        {
            try
            {
                var message = new MimeMessage();
                MailboxAddress emailFrom = new MailboxAddress("Мој Превоз (No Reply)", _mailSettings.SenderEmail);
                message.From.Add(emailFrom);
                message.To.Add(new MailboxAddress(mailData.EmailToName, mailData.EmailToId));
                message.To.Add(new MailboxAddress("Additional Admin", additionalRecipient));
                message.Subject = mailData.EmailSubject;

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = emailBody
                };

                message.Body = bodyBuilder.ToMessageBody();

                using (var mailClient = new MailKit.Net.Smtp.SmtpClient())
                {
                    await mailClient.ConnectAsync(_mailSettings.Server, _mailSettings.Port, MailKit.Security.SecureSocketOptions.Auto);
                    await mailClient.AuthenticateAsync(_mailSettings.Username, _mailSettings.Password);
                    await mailClient.SendAsync(message);
                    await mailClient.DisconnectAsync(true);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: {ex.Message}");
                return false;
            }
        }

    }
}
