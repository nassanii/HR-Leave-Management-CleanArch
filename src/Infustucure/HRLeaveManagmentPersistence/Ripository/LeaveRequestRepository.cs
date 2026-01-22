using HR.LeaveManagement.Application.Contracts.Persistence;
using HRLeaveManagmentPersistence.DatabaseContext;
using HRLeaveManagmentPersistence.Ripository;
using HRLeaveManegent.Domin;
using Microsoft.EntityFrameworkCore;

public class LeaveRequestRepository : GenericRepository<LeaveRequest>, ILeaveRequestRepository
{
    private readonly HRDbContext _db;

    public LeaveRequestRepository(HRDbContext db) : base(db)
    {
        this._db = db;
    }

    public Task<List<LeaveRequest>> GetLeaveRequestsWithDetails()
    {
        var leaveRequests = _db.LeaveRequests
            .Include(lr => lr.LeaveType).ToListAsync();
        return leaveRequests;

    }

    public Task<List<LeaveRequest>> GetLeaveRequestsWithDetails(string employeeId)
    {
        var leaveRequestsByEmployee = _db.LeaveRequests
            .Where(lr => lr.RequestingEmployeeId == employeeId)
            .Include(lr => lr.LeaveType).ToListAsync();
        return leaveRequestsByEmployee;
    }

    public Task<LeaveRequest?> GetLeaveRequestWithDetails(int id)
    {
        var leaveRequest = _db.LeaveRequests
            .Include(lr => lr.LeaveType)
            .FirstOrDefaultAsync(lr => lr.Id == id);
        return leaveRequest;
    }

    public async Task DeleteRequests(string employeeId)
    {
        var requests = await _db.LeaveRequests
            .Where(q => q.RequestingEmployeeId == employeeId)
            .ToListAsync();
        _db.LeaveRequests.RemoveRange(requests);
        await _db.SaveChangesAsync();
    }
}

