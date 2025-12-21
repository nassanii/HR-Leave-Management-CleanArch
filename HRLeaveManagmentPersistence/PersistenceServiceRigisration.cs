using HR.LeaveManagement.Application.Contracts.Persistence;
using HRLeaveManagmentPersistence.DatabaseContext; // تأكد من وجود هذا
using HRLeaveManagmentPersistence.Ripository;      // تأكد من وجود هذا (حسب تسميتك للمجلد)
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HRLeaveManagmentPersistence;

public static class PersistenceServiceRigisration
{
    public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
    {
        // تم التغيير هنا لاستخدام Npgsql
        services.AddDbContext<HRDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // تسجيل المستودعات (Repositories)
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<ILeaveTypeRepository, LeaveTypeRepository>();
        services.AddScoped<ILeaveAllocationRepository, LeaveAlocationRepository>();
        services.AddScoped<ILeaveRequestRepository, LeaveRequestRepository>();

        return services;
    }
}