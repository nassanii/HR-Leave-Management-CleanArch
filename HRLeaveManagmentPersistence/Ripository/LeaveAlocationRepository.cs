using HR.LeaveManagement.Application.Contracts.Persistence;
using HRLeaveManagmentPersistence.DatabaseContext;
using HRLeaveManagmentPersistence.Ripository;
using HRLeaveManegent.Domin.Common;
using Microsoft.EntityFrameworkCore;

public class LeaveAlocationRepository : GenericRepository<LeaveAllocation>, ILeaveAllocationRepository
{
    private readonly HRDbContext _db;

    public LeaveAlocationRepository(HRDbContext db) : base(db)
    {
        this._db = db;
    }

    public async Task AddAlocations(List<LeaveAllocation> allocations)
    {
        await _db.LeaveAllocations.AddRangeAsync(allocations);
        await _db.SaveChangesAsync();
    }

    public async Task<bool> AllocationExists(string employeeId, int leaveTypeId, int period)
    {
        return await _db.LeaveAllocations.AnyAsync(q =>
            q.EmployeeId == employeeId &&
            q.leaveTypeId == leaveTypeId &&
            q.Period == period);
    }

    public Task<List<LeaveAllocation>> GetLeaveAllocationsWithDetails()
    {
        var leaveAllocations = _db.LeaveAllocations
            .Include(q => q.leaveType).ToListAsync();

        return leaveAllocations;
    }

    public async Task<List<LeaveAllocation>> GetLeaveAllocationsWithDetails(string employeeId)
    {
        var leaveAllocations = await _db.LeaveAllocations
            .Where(q => q.EmployeeId == employeeId)
            .Include(q => q.leaveType).ToListAsync();
        return leaveAllocations;
    }

    public async Task<LeaveAllocation?> GetLeaveAllocationWithDetails(int id)
    {
        return await _db.LeaveAllocations
            .Include(q => q.leaveType)
            .FirstOrDefaultAsync(q => q.Id == id);
    }

    public Task<LeaveAllocation?> GetUserAlocation(string employeeId, int leaveTypeId)
    {
        return _db.LeaveAllocations
            .FirstOrDefaultAsync(q => q.EmployeeId == employeeId && q.leaveTypeId == leaveTypeId);
    }
}

