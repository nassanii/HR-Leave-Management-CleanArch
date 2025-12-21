using AutoMapper;
using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Exceptions;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveType.Commands.UpdateLeaveType
{
    public class UpdateLEaveTypeCommandHandler : IRequestHandler<UpdateLeaveTypeCommand, Unit>
    {
        private readonly IMapper _mapper;
        private readonly ILeaveTypeRepository _leaveTypeRepository;
        private readonly IAppLogger<UpdateLEaveTypeCommandHandler> _logger;

        public UpdateLEaveTypeCommandHandler(IMapper mapper, ILeaveTypeRepository leaveTypeRepository, IAppLogger<UpdateLEaveTypeCommandHandler> logger)
        {
            this._mapper = mapper;
            this._leaveTypeRepository = leaveTypeRepository;
            this._logger = logger;
        }
        public async Task<Unit> Handle(UpdateLeaveTypeCommand request, CancellationToken cancellationToken)
        {
            // Validate incoming data
            var validator = new UpdateLeaveTypeCommandValidater();
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                // Handle validation errors
                _logger.LogWarning("Validation errors occurred while updating leave type.");
                throw new BadRequestException("Invalid Leave Type", validationResult);
            }



            // Convert to domain entity object
            var leaveTypeToUpdate = _mapper.Map<HRLeaveManegent.Domin.LeaveType>(request);
            _logger.LogInformation("Leave Type mapped successfully.");


            // add to database
            await _leaveTypeRepository.UpdateAsync(leaveTypeToUpdate);

            // Log information after updating the leave type
            _logger.LogInformation($"Leave Type {leaveTypeToUpdate.Id} updated successfully.");
            // Return record id
            return Unit.Value;
        }
    }
}
