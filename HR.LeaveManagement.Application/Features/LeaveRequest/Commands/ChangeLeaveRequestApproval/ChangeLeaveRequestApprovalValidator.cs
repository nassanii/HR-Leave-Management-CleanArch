using FluentValidation;


namespace HR.LeaveManagement.Application.Features.LeaveRequest.Commands.ChangeLeaveRequestApproval;

public class ChangeLeaveRequestApprovalValidator : AbstractValidator<ChangeLeaveRequestApprovalCommand>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;

    public ChangeLeaveRequestApprovalValidator(ILeaveRequestRepository leaveRequestRepository)
    {
        _leaveRequestRepository = leaveRequestRepository;

        RuleFor(p => p.Id)
            .NotEmpty().WithMessage("Leave Request ID is required")
            .MustAsync(LeaveRequestMustExist).WithMessage("Leave Request does not exist");
    }

    private async Task<bool> LeaveRequestMustExist(int id, CancellationToken arg2)
    {
        var leaveRequest = await _leaveRequestRepository.GetAsync(id);
        return leaveRequest != null;
    }
}
