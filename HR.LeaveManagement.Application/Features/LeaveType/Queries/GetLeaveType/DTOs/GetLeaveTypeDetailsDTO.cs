namespace HR.LeaveManagement.Application.Features.LeaveType.Queries.GetLeaveType.DTOs
{
    public class GetLeaveTypeDetailsDTO
    {
        public int Id { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public string Name { get; set; } = string.Empty;
        public int DefaultDays { get; set; }
    }
}
