namespace HR.LeaveManagement.Application.Features.Employees.Queries.GetEmployeeList;

public class EmployeeListDTO
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime DateJoined { get; set; }

}
