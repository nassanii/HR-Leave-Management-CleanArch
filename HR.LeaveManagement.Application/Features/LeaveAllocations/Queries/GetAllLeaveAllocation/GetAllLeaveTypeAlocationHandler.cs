using AutoMapper;
using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Features.LeaveAllocations.Queries.DTOs;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveAllocations.Queries.GetAllLeaveAllocation;
public class GetAllLeaveTypeAlocationHandler : IRequestHandler<GetAllLeaveTypeAlocationQuery, List<LeaveAllocationDTO>>
{
    private readonly IMapper _mapper;
    private readonly ILeaveAllocationRepository _leaveAllocationRepository;
    private readonly IAppLogger<GetAllLeaveTypeAlocationHandler> _logger;

    public GetAllLeaveTypeAlocationHandler(IMapper mapper, ILeaveAllocationRepository leaveAllocationRepository, IAppLogger<GetAllLeaveTypeAlocationHandler> logger)
    {
        this._mapper = mapper;
        this._leaveAllocationRepository = leaveAllocationRepository;
        this._logger = logger;
    }

    public async Task<List<LeaveAllocationDTO>> Handle(GetAllLeaveTypeAlocationQuery request, CancellationToken cancellationToken)
    {
        // To add leter 
        // -get record for specific user
        // - get allcation per employee 

        var leaveAllocations = await _leaveAllocationRepository.GetLeaveAllocationsWithDetails();
        var leaveAllocationDtos = _mapper.Map<List<LeaveAllocationDTO>>(leaveAllocations);
        return leaveAllocationDtos;

    }
}

