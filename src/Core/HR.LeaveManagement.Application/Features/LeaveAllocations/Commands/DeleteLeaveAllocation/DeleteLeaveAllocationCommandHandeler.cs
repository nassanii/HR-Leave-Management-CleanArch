using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Exceptions;
using HRLeaveManegent.Domin.Common;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.DeleteLeaveAllocation;

public class DeleteLeaveAllocationCommandHandeler : IRequestHandler<DeleteLeaveAllocationCommand, Unit>
{
    private readonly IMediator _mediator;
    private readonly ILeaveAllocationRepository _leaveAllocationRepository;
    private readonly IAppLogger<DeleteLeaveAllocationCommandHandeler> _logger;

    public DeleteLeaveAllocationCommandHandeler(IMediator mediator, ILeaveAllocationRepository leaveAllocationRepository, IAppLogger<DeleteLeaveAllocationCommandHandeler> logger)
    {
        this._mediator = mediator;
        this._leaveAllocationRepository = leaveAllocationRepository;
        this._logger = logger;
    }

    public async Task<Unit> Handle(DeleteLeaveAllocationCommand request, CancellationToken cancellationToken)
    {
        // validate incoming request
        var validator = new DeleteLeaveAllocationCommandValidater(_leaveAllocationRepository);
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            _logger.LogWarning("Validation errors occurred while deleting a leave allocation.");
            throw new BadRequestException("Invalid Leave Allocation Id.", validationResult);
        }

        // retrieve record to delete
        var leaveAllocationToDelete = await _leaveAllocationRepository.GetAsync(request.Id);

        if (leaveAllocationToDelete == null)
        {
            _logger.LogWarning($"Leave Allocation with ID: {request.Id} not found.");
            throw new NotFoundException(nameof(LeaveAllocation), request.Id);
        }

        // remove from the database
        _logger.LogInformation($"Deleting Leave Allocation with ID: {request.Id}");
        await _leaveAllocationRepository.DeleteAsync(leaveAllocationToDelete);
        _logger.LogInformation($"Leave Allocation with ID: {request.Id} deleted successfully.");
        return Unit.Value;


    }
}
