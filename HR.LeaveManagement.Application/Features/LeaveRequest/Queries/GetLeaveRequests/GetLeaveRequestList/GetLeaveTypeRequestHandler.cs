using AutoMapper;
using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Features.LeaveRequest.Queries.DTOs;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveRequest.Queries.GetLeaveRequests.GetLeaveRequestList;

public class GetLeaveRequestListHandler : IRequestHandler<GetLeaveRequestListQuery, List<LeaveRequestListDTO>>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly IMapper _mapper;
    private readonly IAppLogger<GetLeaveRequestListHandler> _logger;

    public GetLeaveRequestListHandler(ILeaveRequestRepository leaveRequestRepository, IMapper mapper, IAppLogger<GetLeaveRequestListHandler> logger)
    {
        this._leaveRequestRepository = leaveRequestRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<List<LeaveRequestListDTO>> Handle(GetLeaveRequestListQuery request, CancellationToken cancellationToken)
    {
        // check if its logged in employee 

        var leaveRequests = await _leaveRequestRepository.GetLeaveRequestsWithDetails();

        var leaveRequestsDTOs = _mapper.Map<List<LeaveRequestListDTO>>(leaveRequests);
        _logger.LogInformation("Retrieved all leave requests successfully.");

        // fill requests with the employee information

        return leaveRequestsDTOs;
    }
}
