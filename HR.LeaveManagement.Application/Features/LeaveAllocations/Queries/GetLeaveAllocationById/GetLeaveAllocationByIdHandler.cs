using AutoMapper;
using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Exceptions;
using HR.LeaveManagement.Application.Features.LeaveAllocations.Queries.DTOs;
using HRLeaveManegent.Domin.Common;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveAllocations.Queries.GetLeaveAllocationById
{
    public class GetLeaveAllocationByIdHandler : IRequestHandler<GetLeaveAllocationByIdQuery, LeaveAllocationDTO>
    {

        private readonly IMapper _mapper;
        private readonly ILeaveAllocationRepository _leaveAllocationRepository;
        private readonly IAppLogger<GetLeaveAllocationByIdHandler> _logger;

        public GetLeaveAllocationByIdHandler(IMapper mapper, ILeaveAllocationRepository leaveAllocationRepository, IAppLogger<GetLeaveAllocationByIdHandler> logger)
        {

            _mapper = mapper;
            _leaveAllocationRepository = leaveAllocationRepository;
            _logger = logger;
        }

        public async Task<LeaveAllocationDTO> Handle(GetLeaveAllocationByIdQuery request, CancellationToken cancellationToken)
        {
            // get leave allocation by id from repository
            var leaveAllocation = await _leaveAllocationRepository.GetAsync(request.Id);

            if (leaveAllocation == null)
            {
                _logger.LogWarning($"Leave Allocation with Id {request.Id} not found.");
                throw new NotFoundException(nameof(LeaveAllocation), request.Id);
            }
            // map to dto
            var leaveAllocationDto = _mapper.Map<LeaveAllocationDTO>(leaveAllocation);
            // return dto
            return leaveAllocationDto;
        }
    }
}
