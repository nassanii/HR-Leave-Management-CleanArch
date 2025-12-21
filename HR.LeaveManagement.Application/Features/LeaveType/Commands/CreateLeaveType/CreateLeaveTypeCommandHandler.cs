using AutoMapper;
using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Exceptions;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveType.Commands.CreateLeaveType
{
    public class CreateLeaveTypeCommandHandler : IRequestHandler<CreateLeaveTypeCommand, int>
    {
        private readonly IMapper _mapper;
        private readonly ILeaveTypeRepository _leaveTypeRepository;
        private readonly IAppLogger<CreateLeaveTypeCommandHandler> _ILogger;

        public CreateLeaveTypeCommandHandler(IMapper mapper, ILeaveTypeRepository leaveTypeRepository, IAppLogger<CreateLeaveTypeCommandHandler> ILooger)
        {
            this._mapper = mapper;
            this._leaveTypeRepository = leaveTypeRepository;
            this._ILogger = ILooger;
        }

        public async Task<int> Handle(CreateLeaveTypeCommand request, CancellationToken cancellationToken)
        {
            // validate data 
            var validator = new CreateLeaveTypeCommandValidater();
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                // handle validation errors
                _ILogger.LogWarning("Validation errors occurred while creating a new leave type.");
                throw new BadRequestException("Invalid Type", validationResult);
            }

            // map to domain entity
            var leaveType = _mapper.Map<HRLeaveManegent.Domin.LeaveType>(request);

            // add to database 
            _ILogger.LogInformation("Creating a new leave type");
            await _leaveTypeRepository.AddAsync(leaveType);


            // return record id

            _ILogger.LogInformation($"Leave type {leaveType.Id} created successfully.");
            return leaveType.Id;
        }
    }
}
