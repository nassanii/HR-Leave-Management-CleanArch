using HRLeaveManegent.Domin.Common;

namespace HRLeaveManegent.Domin;
public class LeaveAllocation : BaseEntity
{
    public int NumberOFdayes { get; set; }
    public LeaveType? leaveType { get; set; }
    public int leaveTypeId { get; set; }

    public int Period { get; set; }

}

