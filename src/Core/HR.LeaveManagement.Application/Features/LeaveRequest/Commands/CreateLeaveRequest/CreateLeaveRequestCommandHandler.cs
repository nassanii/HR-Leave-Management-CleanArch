using AutoMapper;
using HR.LeaveManagement.Application.Contracts.Emial;
using HR.LeaveManagement.Application.Contracts.Identity; // Add using statement
using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Exceptions;
using HR.LeaveManagement.Application.Models;
using HRLeaveManegent.Domin;
using HRLeaveManegent.Domin.Common;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveRequest.Commands.CreateLeaveRequest;

public class CreateLeaveRequestCommandHandler : IRequestHandler<CreateLeaveRequestCommand, Unit>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly ILeaveAllocationRepository _leaveAllocationRepository;
    private readonly IUserService _userService;
    private readonly ILeaveTypeRepository _leaveTypeRepository;
    private readonly IMapper _mapper;
    private readonly IEmailSender _emailSender;
    private readonly IAppLogger<CreateLeaveRequestCommandHandler> _logger;

    public CreateLeaveRequestCommandHandler(
        ILeaveRequestRepository leaveRequestRepository,
        ILeaveAllocationRepository leaveAllocationRepository,
        ILeaveTypeRepository leaveTypeRepository,
        IMapper mapper,
        IEmailSender emailSender,
        IAppLogger<CreateLeaveRequestCommandHandler> logger,
        IUserService userService)
    {
        _leaveRequestRepository = leaveRequestRepository;
        _leaveAllocationRepository = leaveAllocationRepository;
        _leaveTypeRepository = leaveTypeRepository;
        _mapper = mapper;
        _emailSender = emailSender;
        _logger = logger;
        _userService = userService;
    }

    public async Task<Unit> Handle(CreateLeaveRequestCommand request, CancellationToken cancellationToken)
    {
        var validator = new CreateLeaveRequestValidator(_leaveTypeRepository);
        var validationResult = await validator.ValidateAsync(request, cancellationToken);

        if (validationResult.Errors.Any())
            throw new BadRequestException("Invalid Leave Request", validationResult);

        // Get requesting employee's id
        var employeeId = _userService.UserId;

        if (string.IsNullOrEmpty(employeeId))
        {
             throw new Exception("Employee ID not found. Ensure you are logged in.");
        }

        // Calculate requested days
        var requestedDays = CalculateRequestedDays(request.StartDate, request.EndDate);

        // Check employee's allocation
        var period = request.StartDate.Year;
        var allocations = await _leaveAllocationRepository.GetLeaveAllocationsWithDetails();
        var allocation = allocations.FirstOrDefault(a =>
            a.EmployeeId == employeeId &&
            a.leaveTypeId == request.LeaveTypeId &&
            a.Period == period);

        if (allocation == null)
        {
            throw new BadRequestException($"You do not have a leave allocation for this leave type in {period}. Please contact HR.");
        }

        if (allocation.NumberOFdayes < requestedDays)
        {
            throw new BadRequestException($"Insufficient leave balance. You have {allocation.NumberOFdayes} days available, but requested {requestedDays} days.");
        }

        // Create leave request
        var leaveRequest = _mapper.Map<HRLeaveManegent.Domin.LeaveRequest>(request);
        
        // Postgres requires UTC
        leaveRequest.StartDate = DateTime.SpecifyKind(leaveRequest.StartDate, DateTimeKind.Utc);
        leaveRequest.EndDate = DateTime.SpecifyKind(leaveRequest.EndDate, DateTimeKind.Utc);
        leaveRequest.DateRequested = DateTime.UtcNow;

        leaveRequest.RequestingEmployeeId = employeeId;
        _logger.LogInformation($"Creating Leave Request for {requestedDays} days. Employee: {employeeId}, Available: {allocation.NumberOFdayes} days");
        
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

    private int CalculateRequestedDays(DateTime startDate, DateTime endDate)
    {
        // Add 1 because both start and end dates are inclusive
        return (endDate - startDate).Days + 1;
    }
}
