using FluentValidation;

namespace HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.CreateLeaveAllocation
{
    public class CreateLeaveAllocationCommandValidater : AbstractValidator<CreateLeaveAllocationCommand>
    {
        private readonly ILeaveTypeRepository _leaveTypeRepository;

        public CreateLeaveAllocationCommandValidater(ILeaveTypeRepository leaveTypeRepository)
        {
            _leaveTypeRepository = leaveTypeRepository;

            RuleFor(x => x.LeaveTypeId)
                .GreaterThan(0)
                .MustAsync(async (id, token) =>
                {
                    var leaveType = await _leaveTypeRepository.GetAsync(id);
                    return leaveType != null;
                })
                .WithMessage("{PropertyName} does not exist.");
        }
    }
}
