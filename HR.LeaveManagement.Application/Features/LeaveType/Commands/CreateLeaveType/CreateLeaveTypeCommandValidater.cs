using FluentValidation;

namespace HR.LeaveManagement.Application.Features.LeaveType.Commands.CreateLeaveType;

public class CreateLeaveTypeCommandValidater : AbstractValidator<CreateLeaveTypeCommand>
{
    public CreateLeaveTypeCommandValidater()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(100).WithMessage("Name must not exceed 100 characters.");

        RuleFor(x => x.DefaultDays)
            .GreaterThan(0).WithMessage("Default days must be greater than 0.");
    }

}
