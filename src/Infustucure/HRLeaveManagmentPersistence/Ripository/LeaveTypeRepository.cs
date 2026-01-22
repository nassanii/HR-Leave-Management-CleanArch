using HR.LeaveManagement.Application.Contracts.Persistence;
using HRLeaveManagmentPersistence.DatabaseContext;
using HRLeaveManagmentPersistence.Ripository;
using HRLeaveManegent.Domin;
using Microsoft.EntityFrameworkCore;

public class LeaveTypeRepository : GenericRepository<LeaveType>, ILeaveTypeRepository
{
    private readonly HRDbContext _db;

    public LeaveTypeRepository(HRDbContext db) : base(db)
    {
        this._db = db;
    }

    public async Task<bool> IsLeaveTypeUnique(string name)
    {
        return await _db.LeaveTypes.AnyAsync(q => q.Name == name);
    }
}