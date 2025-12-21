using FluentValidation;

namespace HR.LeaveManagement.Application.Features.Employees.Commands.DeleteEmployee;

public class DeleteEmployeeCommandValidator : AbstractValidator<DeleteEmployeeCommand>
{
    public DeleteEmployeeCommandValidator()
    {
        RuleFor(p => p.Id)
            .GreaterThan(0).WithMessage("{PropertyName} must be greater than 0.");
    }
}
