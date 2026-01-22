using AutoMapper;
using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Features.LeaveRequest.Queries.DTOs;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveRequest.Queries.GetLeaveRequestById;

public class GetLeaveRequestByIdQueryHandler : IRequestHandler<GetLeaveRequestByIdQuery, LeaveRequestDTO>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly IMapper _mapper;
    private readonly IAppLogger<GetLeaveRequestByIdQueryHandler> _logger;

    public GetLeaveRequestByIdQueryHandler(ILeaveRequestRepository leaveRequestRepository, IMapper mapper, IAppLogger<GetLeaveRequestByIdQueryHandler> logger)
    {
        _leaveRequestRepository = leaveRequestRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<LeaveRequestDTO> Handle(GetLeaveRequestByIdQuery request, CancellationToken cancellationToken)
    {
        var leaveRequest = await _leaveRequestRepository.GetLeaveRequestWithDetails(request.Id);
        var leaveRequestDTO = _mapper.Map<LeaveRequestDTO>(leaveRequest);

        //  add employee details as needed

        return leaveRequestDTO;
    }
}
