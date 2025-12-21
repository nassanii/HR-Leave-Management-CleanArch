using HRLeaveManagmentPersistence.DatabaseContext;
using HRLeaveManegent.Domin;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace HRLeaveManagement.Persistence.IntegrationTests;

public class HRLeaveManagementDbContextTests
{
    private readonly HRDbContext _hrDbContext;

    public HRLeaveManagementDbContextTests()
    {
        var dbOptions = new DbContextOptionsBuilder<HRDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;
            
        _hrDbContext = new HRDbContext(dbOptions);
    }

    [Fact]
    public async Task Save_SetDateCreatedAndModified()
    {
        // Arrange
        var leaveType = new LeaveType
        {
            Id = 1,
            DefaultDays = 10,
            Name = "Test Vacation"
        };

        // Act
        await _hrDbContext.LeaveTypes.AddAsync(leaveType);
        await _hrDbContext.SaveChangesAsync();

        // Assert
        leaveType.DateCreated.ShouldNotBeNull();
        leaveType.DateModified.ShouldNotBeNull();
    }
}
