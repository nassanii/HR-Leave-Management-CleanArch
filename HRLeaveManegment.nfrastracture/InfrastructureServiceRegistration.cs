using HR.LeaveManagement.Application.Contracts.Emial;
using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Models;
using HRLeaveManegment.nfrastracture.EmailService;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HRLeaveManegment.nfrastracture;

public static class InfrastructureServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Configure infrastructure services here
        services.Configure<EmialSettings>(configuration.GetSection("EmailSettings"));
        services.AddTransient<IEmailSender, EmailSender>();
        services.AddScoped(typeof(IAppLogger<>), typeof(Logging.LoggingAdapter<>));
        return services;
    }
}
