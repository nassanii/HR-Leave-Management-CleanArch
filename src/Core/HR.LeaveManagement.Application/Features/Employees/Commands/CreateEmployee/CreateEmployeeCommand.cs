using MediatR;

namespace HR.LeaveManagement.Application.Features.Employees.Commands.CreateEmployee;

public class CreateEmployeeCommand : IRequest<int>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime DateJoined { get; set; }
    public string IdentityId { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
