using FluentValidation;
using HR.LeaveManagement.Application.Contracts.Emial;
using HR.LeaveManagement.Application.Contracts.ILogging;

using HR.LeaveManagement.Application.Exceptions;
using HR.LeaveManagement.Application.Models;
using MediatR;
using HRLeaveManegent.Domin.Common;

namespace HR.LeaveManagement.Application.Features.LeaveRequest.Commands.ChangeLeaveRequestApproval;

public class ChangeLeaveRequestApprovalCommandHandler : IRequestHandler<ChangeLeaveRequestApprovalCommand, Unit>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly ILeaveAllocationRepository _leaveAllocationRepository;
    private readonly IEmailSender _emailSender;
    private readonly IAppLogger<ChangeLeaveRequestApprovalCommandHandler> _logger;

    public ChangeLeaveRequestApprovalCommandHandler(
        ILeaveRequestRepository leaveRequestRepository,
        ILeaveAllocationRepository leaveAllocationRepository,
        IEmailSender emailSender,
        IAppLogger<ChangeLeaveRequestApprovalCommandHandler> logger)
    {
        _leaveRequestRepository = leaveRequestRepository;
        _leaveAllocationRepository = leaveAllocationRepository;
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

        // Store previous approval state to handle reversals
        var previousApprovalState = leaveRequest.Approved;

        // Calculate requested days (inclusive of both start and end dates)
        var requestedDays = CalculateRequestedDays(leaveRequest.StartDate, leaveRequest.EndDate);

        // Find the appropriate leave allocation
        var period = leaveRequest.StartDate.Year;
        var allocations = await _leaveAllocationRepository.GetLeaveAllocationsWithDetails();
        var allocation = allocations.FirstOrDefault(a =>
            a.EmployeeId == leaveRequest.RequestingEmployeeId &&
            a.leaveTypeId == leaveRequest.LeaveTypeId &&
            a.Period == period);

        if (allocation == null)
        {
            throw new BadRequestException($"No leave allocation found for employee {leaveRequest.RequestingEmployeeId} for leave type {leaveRequest.LeaveTypeId} in year {period}");
        }

        // Handle approval state changes
        if (request.Approved && previousApprovalState != true)
        {
            // Approving a new request or re-approving a rejected one
            if (allocation.NumberOFdayes < requestedDays)
            {
                throw new BadRequestException($"Insufficient leave balance. Available: {allocation.NumberOFdayes} days, Requested: {requestedDays} days");
            }

            // Deduct days from allocation
            allocation.NumberOFdayes -= requestedDays;
            await _leaveAllocationRepository.UpdateAsync(allocation);
            _logger.LogInformation($"Deducted {requestedDays} days from allocation. New balance: {allocation.NumberOFdayes} days");
        }
        else if (!request.Approved && previousApprovalState == true)
        {
            // Rejecting a previously approved request - restore the days
            allocation.NumberOFdayes += requestedDays;
            await _leaveAllocationRepository.UpdateAsync(allocation);
            _logger.LogInformation($"Restored {requestedDays} days to allocation. New balance: {allocation.NumberOFdayes} days");
        }

        // Update the approval status
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

    private int CalculateRequestedDays(DateTime startDate, DateTime endDate)
    {
        // Add 1 because both start and end dates are inclusive
        return (endDate - startDate).Days + 1;
    }
}
