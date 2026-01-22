using FluentValidation;

namespace HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.UpdateLeaveAllocation;

public class UpdateLeaveAllocationCommandValidater : AbstractValidator<UpdateLeaveAllocationCommand>
{
    private readonly ILeaveAllocationRepository _leaveAllocationRepository;

    public UpdateLeaveAllocationCommandValidater(ILeaveAllocationRepository leaveAllocationRepository)
    {
        this._leaveAllocationRepository = leaveAllocationRepository;


        RuleFor(x => x.NumberOFdayes)
            .GreaterThan(0).WithMessage("Number of days must be greater than zero.");

        RuleFor(x => x.leaveTypeId)
            .NotEmpty().WithMessage("Leave type ID must not be empty.");

        RuleFor(x => x.Period)
            .GreaterThan(0).WithMessage("Period must be greater than zero.");

        RuleFor(x => x.Id)
            .MustAsync(ExistInDatabase).WithMessage("Leave allocation with the specified ID does not exist.");




    }

    private async Task<bool> ExistInDatabase(int id, CancellationToken cancellationToken)
    {
        var leaveAllocation = await _leaveAllocationRepository.GetAsync(id);
        return leaveAllocation != null;
    }
}
