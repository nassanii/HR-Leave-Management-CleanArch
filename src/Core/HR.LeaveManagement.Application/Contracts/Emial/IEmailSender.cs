using HR.LeaveManagement.Application.Models;

namespace HR.LeaveManagement.Application.Contracts.Emial
{
    public interface IEmailSender
    {
        public Task<bool> SendEmailAsync(EmailMassage emailMassage);
    }
}
