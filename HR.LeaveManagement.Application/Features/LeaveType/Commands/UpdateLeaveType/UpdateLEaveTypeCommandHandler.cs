using AutoMapper;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveType.Commands.UpdateLeaveType
{
    public class UpdateLEaveTypeCommandHandler : IRequestHandler<UpdateLeaveTypeCommand, Unit>
    {
        private readonly IMapper _mapper;
        private readonly ILeaveTypeRepository _leaveTypeRepository;

        public UpdateLEaveTypeCommandHandler(IMapper mapper, ILeaveTypeRepository leaveTypeRepository)
        {
            this._mapper = mapper;
            this._leaveTypeRepository = leaveTypeRepository;
        }
        public async Task<Unit> Handle(UpdateLeaveTypeCommand request, CancellationToken cancellationToken)
        {
            // Validate incoming data


            // Convert to domain entity object
            var leaveTypeToUpdate = _mapper.Map<HRLeaveManegent.Domin.LeaveType>(request);

            // add to database
            await _leaveTypeRepository.UpdateAsync(leaveTypeToUpdate);

            // return Unit.Value
            return Unit.Value;
        }
    }
}
