using AutoMapper;
using HR.LeaveManagement.Application.Contracts.Emial;
using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Exceptions;
using HR.LeaveManagement.Application.Models;
using HRLeaveManegent.Domin;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveRequest.Commands.CreateLeaveRequest;

public class CreateLeaveRequestCommandHandler : IRequestHandler<CreateLeaveRequestCommand, Unit>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly ILeaveTypeRepository _leaveTypeRepository;
    private readonly IMapper _mapper;
    private readonly IEmailSender _emailSender;
    private readonly IAppLogger<CreateLeaveRequestCommandHandler> _logger;

    public CreateLeaveRequestCommandHandler(ILeaveRequestRepository leaveRequestRepository,
        ILeaveTypeRepository leaveTypeRepository,
        IMapper mapper,
        IEmailSender emailSender,
        IAppLogger<CreateLeaveRequestCommandHandler> logger)
    {
        _leaveRequestRepository = leaveRequestRepository;
        _leaveTypeRepository = leaveTypeRepository;
        _mapper = mapper;
        _emailSender = emailSender;
        _logger = logger;
    }

    public async Task<Unit> Handle(CreateLeaveRequestCommand request, CancellationToken cancellationToken)
    {
        var validator = new CreateLeaveRequestValidator(_leaveTypeRepository);
        var validationResult = await validator.ValidateAsync(request, cancellationToken);

        if (validationResult.Errors.Any())
            throw new BadRequestException("Invalid Leave Request", validationResult);

        // Get requesting employee's id
        // var employeeId = _userService.UserId;

        // Check on employee's allocation

        // if allocations aren't enough, return validation error with message

        // Create leave request
        var leaveRequest = _mapper.Map<HRLeaveManegent.Domin.LeaveRequest>(request);
        
        // Postgres requires UTC
        leaveRequest.StartDate = DateTime.SpecifyKind(leaveRequest.StartDate, DateTimeKind.Utc);
        leaveRequest.EndDate = DateTime.SpecifyKind(leaveRequest.EndDate, DateTimeKind.Utc);

        // leaveRequest.RequestingEmployeeId = employeeId;
        
        await _leaveRequestRepository.AddAsync(leaveRequest);

        try
        {
            var email = new EmailMassage
            {
                To = string.Empty, // Get email from employee record
                Subject = "Leave Request Submitted",
                Body = $"Your leave request for {request.StartDate:D} to {request.EndDate:D} has been submitted successfully."
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
