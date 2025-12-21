using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Exceptions;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveType.Commands.DeleteLeaveType
{
    internal class DeleteLeaveTypeCommandHandler : IRequestHandler<DeleteLeaveTypeCommand, Unit>
    {
        private readonly ILeaveTypeRepository _leaveTypeRepository;
        private readonly IAppLogger<DeleteLeaveTypeCommandHandler> _logger;

        public DeleteLeaveTypeCommandHandler(ILeaveTypeRepository leaveTypeRepository, IAppLogger<DeleteLeaveTypeCommandHandler> logger)
        {
            _leaveTypeRepository = leaveTypeRepository;
            _logger = logger;
        }

        public async Task<Unit> Handle(DeleteLeaveTypeCommand request, CancellationToken cancellationToken)
        {

            _logger.LogInformation($"Attempting to delete Leave Type with ID: {request.Id}");


            // retrieve record to delete
            var leaveTypeToDelete = await _leaveTypeRepository.GetAsync(request.Id);

            // verify record exists
            if (leaveTypeToDelete == null)
            {
                _logger.LogWarning($"Leave Type with ID: {request.Id} not found.");
                throw new NotFoundException(nameof(LeaveType), request.Id);
            }


            // remove from the  database
            _logger.LogInformation($"Deleting Leave Type with ID: {request.Id}");
            await _leaveTypeRepository.DeleteAsync(leaveTypeToDelete);

            // return Unit.Value
            _logger.LogInformation($"Leave Type with ID: {request.Id} deleted successfully.");
            return Unit.Value;

        }
    }
}
