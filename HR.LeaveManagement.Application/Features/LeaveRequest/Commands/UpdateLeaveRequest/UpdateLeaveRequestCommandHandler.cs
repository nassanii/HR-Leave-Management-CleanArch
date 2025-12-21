using AutoMapper;
using FluentValidation;
using HR.LeaveManagement.Application.Contracts.Emial;
using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Exceptions;
using HR.LeaveManagement.Application.Models;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveRequest.Commands.UpdateLeaveRequest;

public class UpdateLeaveRequestCommandHandler : IRequestHandler<UpdateleaveRequestCommand, Unit>
{

    private readonly ILeaveTypeRepository _leaveTypeRepository;
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly IMapper _mapper;
    private readonly IAppLogger<UpdateLeaveRequestCommandHandler> _logger;
    private readonly IEmailSender _emailSender;

    public UpdateLeaveRequestCommandHandler(ILeaveTypeRepository leaveTypeRepository, ILeaveRequestRepository leaveRequestRepository,
          IMapper mapper, IAppLogger<UpdateLeaveRequestCommandHandler> logger, IEmailSender emailSender)
    {

        _leaveTypeRepository = leaveTypeRepository;
        _leaveRequestRepository = leaveRequestRepository;
        _mapper = mapper;
        _logger = logger;
        _emailSender = emailSender;
    }

    public async Task<Unit> Handle(UpdateleaveRequestCommand request, CancellationToken cancellationToken)
    {
        // get existing leave request
        var leaveRequestToUpdate = await _leaveRequestRepository.GetAsync(request.Id);
        // validate leave request
        if (leaveRequestToUpdate == null)
        {
            _logger.LogWarning($"Leave Request with ID: {request.Id} not found.");
            throw new NotFoundException(nameof(LeaveRequest), request.Id);
        }

        var validator = new UpdateLeaveRequestCommandHandlerValidator(_leaveRequestRepository, _leaveTypeRepository);
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }


        leaveRequestToUpdate = _mapper.Map(request, leaveRequestToUpdate);
        await _leaveRequestRepository.UpdateAsync(leaveRequestToUpdate);

        // send notification email

        try
        {
            var email = new EmailMassage
            {
                To = string.Empty, // git email form employee record
                Subject = "Leave Request Updated",
                Body = $"Your leave request with ID: {request.Id} has been updated."
            };
            await _emailSender.SendEmailAsync(email);

            _logger.LogInformation($"Leave Request with ID: {request.Id} updated successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogWarning($"Error sending email for updated Leave Request ID: {request.Id}. Error: {ex.Message}");
        }
        return Unit.Value;
    }
}
