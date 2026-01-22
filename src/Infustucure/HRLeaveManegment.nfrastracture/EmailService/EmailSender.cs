using HR.LeaveManagement.Application.Contracts.Emial;
using HR.LeaveManagement.Application.Models;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace HRLeaveManegment.nfrastracture.EmailService;

public class EmailSender : IEmailSender
{

    public EmialSettings _emailsettings { get; }
    public EmailSender(IOptions<EmialSettings> emailSettings)
    {

        _emailsettings = emailSettings.Value;
    }
    public async Task<bool> SendEmailAsync(EmailMassage emailMassage)
    {
        var clinte = new SendGridClient(_emailsettings.ApiKey);
        var to = new EmailAddress(emailMassage.To);
        var from = new EmailAddress(_emailsettings.FromName, _emailsettings.FromAddress);
        var htmlContent = emailMassage.Body;
        var plainTextContent = emailMassage.Body;

        var msg = MailHelper.CreateSingleEmail(
            from,
            to,
            emailMassage.Subject,
            plainTextContent,
            htmlContent
        );


        var response = await clinte.SendEmailAsync(msg);

        return response.IsSuccessStatusCode;
    }
}