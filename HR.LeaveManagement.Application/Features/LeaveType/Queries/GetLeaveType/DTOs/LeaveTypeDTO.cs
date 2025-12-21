namespace HR.LeaveManagement.Application.Features.LeaveType.Queries.GetLeaveType.DTOs
{
    public class LeaveTypeDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int DefaultDays { get; set; }
        public DateTime? DateModified { get; set; }
    }
}
