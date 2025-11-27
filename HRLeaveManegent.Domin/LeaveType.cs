using HRLeaveManegent.Domin.Common;

namespace HRLeaveManegent.Domin;

public class LeaveType : BaseEntity
{

    public string Name { get; set; } = string.Empty;
    public int DefaultDays { get; set; }
}


