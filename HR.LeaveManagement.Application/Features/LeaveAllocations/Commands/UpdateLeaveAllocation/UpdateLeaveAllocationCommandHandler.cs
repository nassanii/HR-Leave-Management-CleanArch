using AutoMapper;
using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Exceptions;
using HRLeaveManegent.Domin.Common;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.UpdateLeaveAllocation;

public class UpdateLeaveAllocationCommandHandler : IRequestHandler<UpdateLeaveAllocationCommand, Unit>
{

    private readonly IMapper _mapper;
    private readonly ILeaveAllocationRepository _leaveAllocationRepository;
    private readonly IAppLogger<UpdateLeaveAllocationCommandHandler> _logger;

    public UpdateLeaveAllocationCommandHandler(IMapper mapper, ILeaveAllocationRepository leaveAllocationRepository, IAppLogger<UpdateLeaveAllocationCommandHandler> logger)
    {

        _mapper = mapper;
        _leaveAllocationRepository = leaveAllocationRepository;
        _logger = logger;
    }

    public async Task<Unit> Handle(UpdateLeaveAllocationCommand request, CancellationToken cancellationToken)
    {
        // validate incoming data
        var validator = new UpdateLeaveAllocationCommandValidater(_leaveAllocationRepository);
        var validationResult = validator.Validate(request);
        if (!validationResult.IsValid)
        {
            // handle validation errors
            _logger.LogWarning("Validation errors occurred while updating leave allocation.");
            throw new BadRequestException("Invalid Leave Allocation", validationResult);
        }

        if (await _leaveAllocationRepository.GetAsync(request.Id) is null)
        {
            _logger.LogWarning($"Leave Allocation with Id {request.Id} not found.");
            throw new NotFoundException(nameof(LeaveAllocation), request.Id);
        }

        // map to domain entity
        var leaveAllocationToUpdate = _mapper.Map<LeaveAllocation>(request);

        // update repository
        await _leaveAllocationRepository.UpdateAsync(leaveAllocationToUpdate);



        // return 
        return Unit.Value;
    }
}
