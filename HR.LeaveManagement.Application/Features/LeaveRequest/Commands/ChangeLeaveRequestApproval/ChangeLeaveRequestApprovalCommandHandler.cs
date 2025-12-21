using FluentValidation;
using HR.LeaveManagement.Application.Contracts.Emial;
using HR.LeaveManagement.Application.Contracts.ILogging;

using HR.LeaveManagement.Application.Exceptions;
using HR.LeaveManagement.Application.Models;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveRequest.Commands.ChangeLeaveRequestApproval;

public class ChangeLeaveRequestApprovalCommandHandler : IRequestHandler<ChangeLeaveRequestApprovalCommand, Unit>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly IEmailSender _emailSender;
    private readonly IAppLogger<ChangeLeaveRequestApprovalCommandHandler> _logger;

    public ChangeLeaveRequestApprovalCommandHandler(ILeaveRequestRepository leaveRequestRepository,
        IEmailSender emailSender,
        IAppLogger<ChangeLeaveRequestApprovalCommandHandler> logger)
    {
        _leaveRequestRepository = leaveRequestRepository;
        _emailSender = emailSender;
        _logger = logger;
    }

    public async Task<Unit> Handle(ChangeLeaveRequestApprovalCommand request, CancellationToken cancellationToken)
    {
        var leaveRequest = await _leaveRequestRepository.GetAsync(request.Id);

        if (leaveRequest is null)
        {
            throw new NotFoundException(nameof(LeaveRequest), request.Id);
        }

        var validator = new ChangeLeaveRequestApprovalValidator(_leaveRequestRepository);
        var validationResult = await validator.ValidateAsync(request, cancellationToken);

        if (validationResult.Errors.Any())
            throw new BadRequestException("Invalid Leave Request Approval Request", validationResult);

        leaveRequest.Approved = request.Approved;
        await _leaveRequestRepository.UpdateAsync(leaveRequest);

        try
        {
            var email = new EmailMassage
            {
                To = string.Empty, 
                Subject = "Leave Request Approval Update",
                Body = $"Your leave request for {leaveRequest.StartDate:D} to {leaveRequest.EndDate:D} has been updated. Approval Status: {(request.Approved ? "Approved" : "Rejected")}."
            };

            await _emailSender.SendEmailAsync(email);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex.Message);
        }

        return Unit.Value;
    }
}
