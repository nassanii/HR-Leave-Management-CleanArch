using HR.LeaveManagement.Application.Models.Identity;

namespace HR.LeaveManagement.Application.Contracts.Identity
{
    public interface IUserService
    {
        Task<List<ApplicationUser>> GetEmployees();
        Task<ApplicationUser> GetEmployee(string id);
        public string UserId { get; }
        Task<bool> IsInRoleAsync(string userId, string role);
    }
}
