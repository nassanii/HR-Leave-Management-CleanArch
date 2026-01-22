using FluentValidation;

namespace HR.LeaveManagement.Application.Features.LeaveType.Commands.UpdateLeaveType
{
    public class UpdateLeaveTypeCommandValidater : AbstractValidator<UpdateLeaveTypeCommand>
    {
        public UpdateLeaveTypeCommandValidater()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Leave type name is required.")
                .MaximumLength(100).WithMessage("Leave type name must not exceed 100 characters.");

            RuleFor(x => x.DefaultDays)
                .GreaterThan(0).WithMessage("Default days must be greater than zero.")
                .LessThanOrEqualTo(100).WithMessage("Default days must not exceed 100.");


        }
    }
}
