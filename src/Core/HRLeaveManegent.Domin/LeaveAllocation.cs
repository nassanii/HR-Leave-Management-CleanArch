namespace HRLeaveManegent.Domin.Common;
public class LeaveAllocation : BaseEntity
{
    public int NumberOFdayes { get; set; }
    public int leaveTypeId { get; set; }
    public LeaveType? leaveType { get; set; }
    public int Period { get; set; }
    public string EmployeeId { get; set; } = string.Empty;
}

