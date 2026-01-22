using HRLeaveManegent.Domin;

namespace HR.LeaveManagement.Application.Contracts.Persistence;

public interface ILeaveRequestRepository : IGenericRepository<LeaveRequest>
{
    public Task<List<LeaveRequest>> GetLeaveRequestsWithDetails();
    public Task<LeaveRequest?> GetLeaveRequestWithDetails(int id);
    public Task<List<LeaveRequest>> GetLeaveRequestsWithDetails(string employeeId);
    public Task DeleteRequests(string employeeId);
}
