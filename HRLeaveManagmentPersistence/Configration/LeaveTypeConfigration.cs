using HRLeaveManegent.Domin;
using Microsoft.EntityFrameworkCore;

namespace HRLeaveManagmentPersistence.Configration
{
    internal class LeaveTypeConfigration : IEntityTypeConfiguration<LeaveType>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<LeaveType> builder)
        {
            builder.HasData(
                new LeaveType
                {
                    Id = 1,
                    Name = "Vacation",
                    DefaultDays = 10,
                    DateCreated = DateTime.UtcNow
                },
                new LeaveType
                {
                    Id = 2,
                    Name = "Sick",
                    DefaultDays = 12,
                    DateCreated = DateTime.UtcNow
                }
            );
        }
    }
}
