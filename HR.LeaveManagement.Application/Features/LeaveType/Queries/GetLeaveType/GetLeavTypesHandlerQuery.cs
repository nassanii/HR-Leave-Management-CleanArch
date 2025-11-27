using AutoMapper;
using HR.LeaveManagement.Application.Features.LeaveType.Queries.GetLeaveType.DTOs;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveType.Queries.GetAllLeaveType
{
    public class GetLeavTypesHandlerQuery : IRequestHandler<GetLeaveTypeQuery, List<LeaveTypeDTO>>
    {
        private readonly IMapper _mapper;
        private readonly ILeaveTypeRepository _leaveTypeRepository;

        public GetLeavTypesHandlerQuery(IMapper mapper, ILeaveTypeRepository leaveTypeRepository)
        {
            this._mapper = mapper;
            this._leaveTypeRepository = leaveTypeRepository;
        }

        public async Task<List<LeaveTypeDTO>> Handle(GetLeaveTypeQuery request, CancellationToken cancellationToken)
        {
            // query the database
            var leaveTypes = await _leaveTypeRepository.GetAllAsync();



            // map data to dto
            var data = _mapper.Map<List<LeaveTypeDTO>>(leaveTypes);
            // return dto list
            return data;
        }
    }


}
