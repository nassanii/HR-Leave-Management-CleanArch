using HR.LeaveManagement.Application.Features.LeaveType.Queries.GetLeaveType.DTOs;

namespace HR.LeaveManagement.Application.Features.LeaveAllocations.Queries.DTOs;

public class LeaveAllocationDTO
{
    public int Id { get; set; }
    public int NumberOFdayes { get; set; }
    public int leaveTypeId { get; set; }
    public LeaveTypeDTO? leaveType { get; set; }
    public int Period { get; set; }
    public string EmployeeId { get; set; } = string.Empty;
}


