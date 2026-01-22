using AutoMapper;
using HR.LeaveManagement.Application.Exceptions;
using HR.LeaveManagement.Application.Features.LeaveType.Queries.GetLeaveType.DTOs;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveType.Queries.GetAllLeaveType
{
    internal class GetLeaveTypeByIdDetailsHandler : IRequestHandler<GetLeaveTypeByIdDetailsQuery, GetLeaveTypeDetailsDTO>
    {
        private readonly IMapper _mapper;
        private readonly ILeaveTypeRepository _leaveTypeRepository;

        public GetLeaveTypeByIdDetailsHandler(IMapper mapper, ILeaveTypeRepository leaveTypeRepository)
        {
            _mapper = mapper;
            _leaveTypeRepository = leaveTypeRepository;
        }

        public async Task<GetLeaveTypeDetailsDTO> Handle(GetLeaveTypeByIdDetailsQuery request, CancellationToken cancellationToken)
        {


            // query the database
            var leaveType = await _leaveTypeRepository.GetAsync(request.Id);

            // verify that record exists
            if (leaveType == null)
            {
                throw new NotFoundException(nameof(LeaveType), request.Id);
            }

            // map data to dto
            var data = _mapper.Map<GetLeaveTypeDetailsDTO>(leaveType);
            // return dto 
            return data;

        }
    }
}
