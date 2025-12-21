using HRLeaveManegent.Domin.Common;

namespace HRLeaveManegent.Domin;

public class Employee : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime DateJoined { get; set; }
    public DateTime? DateOfBirth { get; set; }
}
