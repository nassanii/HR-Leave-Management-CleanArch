using HRLeaveManegent.Domin.Common;

namespace HR.LeaveManagement.Application.Contracts.Persistence;

public interface ILeaveAllocationRepository : IGenericRepository<LeaveAllocation>
{
    public Task<List<LeaveAllocation>> GetLeaveAllocationsWithDetails();
    public Task<LeaveAllocation?> GetLeaveAllocationWithDetails(int id);
    public Task<List<LeaveAllocation>> GetLeaveAllocationsWithDetails(string employeeId);
    public Task<bool> AllocationExists(string employeeId, int leaveTypeId, int period);
    public Task AddAlocations(List<LeaveAllocation> allocations);
    public Task<LeaveAllocation?> GetUserAlocation(string employeeId, int leaveTypeId);
}
