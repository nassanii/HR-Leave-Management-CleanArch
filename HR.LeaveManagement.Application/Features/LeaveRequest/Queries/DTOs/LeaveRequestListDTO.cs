using HR.LeaveManagement.Application.Features.LeaveType.Queries.GetLeaveType.DTOs;

namespace HR.LeaveManagement.Application.Features.LeaveRequest.Queries.DTOs;

public class LeaveRequestListDTO
{
    public int Id { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public LeaveTypeDTO LeaveType { get; set; }
    public DateTime DateRequested { get; set; }
    public bool? Approved { get; set; }
    public string RequestingEmployeeId { get; set; } = string.Empty;
}
