using MediatR;

namespace HR.LeaveManagement.Application.Features.Employees.Commands.DeleteEmployee;

public class DeleteEmployeeCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
