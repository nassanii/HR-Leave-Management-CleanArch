using FluentValidation;

using HR.LeaveManagement.Application.Features.LeaveRequest.Shared;

namespace HR.LeaveManagement.Application.Features.LeaveRequest.Commands.CreateLeaveRequest;

public class CreateLeaveRequestValidator : AbstractValidator<CreateLeaveRequestCommand>
{
    private readonly ILeaveTypeRepository _leaveTypeRepository;

    public CreateLeaveRequestValidator(ILeaveTypeRepository leaveTypeRepository)
    {
        _leaveTypeRepository = leaveTypeRepository;
        Include(new BaseLeaveRequestValidator(_leaveTypeRepository));
    }
}
