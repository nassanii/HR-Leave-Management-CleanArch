using FluentValidation;

namespace HR.LeaveManagement.Application.Features.LeaveRequest.Shared
{
    public class BaseLeaveRequestValidator : AbstractValidator<BaseLeaveRequest>
    {
        private readonly ILeaveTypeRepository _leaveTypeRepository;

        public BaseLeaveRequestValidator(ILeaveTypeRepository leaveTypeRepository)
        {
            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Start date is required.")
                .LessThanOrEqualTo(x => x.EndDate).WithMessage("Start date must be before or equal to end date.");

            RuleFor(x => x.EndDate).NotEmpty().WithMessage("End date is required.")
                .GreaterThanOrEqualTo(x => x.StartDate).WithMessage("End date must be after or equal to start date.");

            RuleFor(x => x.LeaveTypeId)
                .GreaterThan(0).WithMessage("Leave type is required.");

            RuleFor(x => x.LeaveTypeId).MustAsync(BeAValidLeaveTypeId)
                .WithMessage("Leave type does not exist.");

            _leaveTypeRepository = leaveTypeRepository;
        }

        protected async Task<bool> BeAValidLeaveTypeId(int leaveTypeId, CancellationToken cancellationToken)
        {
            var leaveType = await _leaveTypeRepository.GetAsync(leaveTypeId);
            return leaveType != null;
        }
    }
}
