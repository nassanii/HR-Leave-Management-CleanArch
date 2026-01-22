using HR.LeaveManagement.Application.Features.LeaveType.Queries.GetLeaveType.DTOs;

namespace HR.LeaveManagement.Application.Features.LeaveRequest.Queries.DTOs
{
    public class LeaveRequestDTO
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public LeaveTypeDTO LeaveType { get; set; }
        public int LeaveTypeId { get; set; }

        public DateTime DateRequested { get; set; }
        public string? RequestComments { get; set; }

        public bool? Approved { get; set; }
        public bool Cancelled { get; set; }

        public string RequestingEmployeeId { get; set; } = string.Empty;
    }
}
