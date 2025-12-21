using FluentValidation;
using HR.LeaveManagement.Application.Contracts.Persistence;
using HRLeaveManegent.Domin;

namespace HR.LeaveManagement.Application.Features.Employees.Commands.UpdateEmployee;

public class UpdateEmployeeCommandValidator : AbstractValidator<UpdateEmployeeCommand>
{
    private readonly IGenericRepository<Employee> _employeeRepository;

    public UpdateEmployeeCommandValidator(IGenericRepository<Employee> employeeRepository)
    {
        _employeeRepository = employeeRepository;

        RuleFor(p => p.Id)
            .NotNull()
            .MustAsync(EmployeeMustExist).WithMessage("{PropertyName} must be present");

        RuleFor(p => p.FirstName)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull()
            .MaximumLength(50).WithMessage("{PropertyName} must not exceed 50 characters.");

        RuleFor(p => p.LastName)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull()
            .MaximumLength(50).WithMessage("{PropertyName} must not exceed 50 characters.");

        RuleFor(p => p.Email)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .EmailAddress().WithMessage("{PropertyName} is not a valid email address.")
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");

        RuleFor(p => p.DateOfBirth)
            .LessThan(DateTime.Now).WithMessage("{PropertyName} must be in the past.")
            .When(p => p.DateOfBirth.HasValue);
    }

    private async Task<bool> EmployeeMustExist(int id, CancellationToken arg2)
    {
        var employee = await _employeeRepository.GetAsync(id);
        return employee != null;
    }
}
