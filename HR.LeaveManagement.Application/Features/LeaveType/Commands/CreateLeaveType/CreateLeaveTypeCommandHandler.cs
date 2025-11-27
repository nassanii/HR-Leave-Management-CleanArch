using AutoMapper;
using HR.LeaveManagement.Application.Exceptions;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveType.Commands.CreateLeaveType
{
    public class CreateLeaveTypeCommandHandler : IRequestHandler<CreateLeaveTypeCommand, int>
    {
        private readonly IMapper _mapper;
        private readonly ILeaveTypeRepository _leaveTypeRepository;

        public CreateLeaveTypeCommandHandler(IMapper mapper, ILeaveTypeRepository leaveTypeRepository)
        {
            this._mapper = mapper;
            this._leaveTypeRepository = leaveTypeRepository;
        }

        public async Task<int> Handle(CreateLeaveTypeCommand request, CancellationToken cancellationToken)
        {
            // validate data 
            var validator = new CreateLeaveTypeCommandValidater();
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                // handle validation errors
                throw new BadRequestException("Invalid Type", validationResult);
            }

            // map to domain entity
            var leaveType = _mapper.Map<HRLeaveManegent.Domin.LeaveType>(request);

            // add to database 
            var response = await _leaveTypeRepository.AddAsync(leaveType);

            // return record id
            return response.Id;
        }
    }
}
