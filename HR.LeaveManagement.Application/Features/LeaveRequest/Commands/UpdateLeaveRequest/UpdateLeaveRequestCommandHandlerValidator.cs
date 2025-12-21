using FluentValidation;
using HR.LeaveManagement.Application.Features.LeaveRequest.Shared;

namespace HR.LeaveManagement.Application.Features.LeaveRequest.Commands.UpdateLeaveRequest;

public class UpdateLeaveRequestCommandHandlerValidator : AbstractValidator<UpdateleaveRequestCommand>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly ILeaveTypeRepository _leaveTypeRepository;

    public UpdateLeaveRequestCommandHandlerValidator(ILeaveRequestRepository leaveRequestRepository, ILeaveTypeRepository leaveTypeRepository)
    {
        _leaveRequestRepository = leaveRequestRepository;
        _leaveTypeRepository = leaveTypeRepository;
        Include(new BaseLeaveRequestValidator(_leaveTypeRepository));


        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Leave Request ID is required.")
            .MustAsync(ExistInDatabase).WithMessage("Leave Request with the specified ID does not exist.");

    }

    private async Task<bool> ExistInDatabase(int id, CancellationToken cancellationToken)
    {
        var leaveRequest = await _leaveRequestRepository.GetAsync(id);
        return leaveRequest != null;
    }
}
