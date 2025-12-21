using FluentValidation;

namespace HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.DeleteLeaveAllocation;

public class DeleteLeaveAllocationCommandValidater : AbstractValidator<DeleteLeaveAllocationCommand>
{
    public DeleteLeaveAllocationCommandValidater(ILeaveAllocationRepository leaveAllocationRepository)
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .MustAsync(async (id, cancellation) =>
            {
                var leaveAllocation = await leaveAllocationRepository.GetAsync(id);
                return leaveAllocation != null;
            })
            .WithMessage("Leave allocation does not exist.");


    }
}
