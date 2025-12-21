using AutoMapper;
using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Exceptions;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveRequest.Commands.DeleteLeaveRequest
{
    public class DeleteLeaveRequestCommandHandler : IRequestHandler<DeleteLeaveRequestCommand, Unit>
    {

        private readonly ILeaveRequestRepository _leaveRequestRepository;
        private readonly IMapper _mapper;
        private readonly IAppLogger<DeleteLeaveRequestCommandHandler> _logger;

        public DeleteLeaveRequestCommandHandler(ILeaveRequestRepository leaveRequestRepository, IMapper mapper, IAppLogger<DeleteLeaveRequestCommandHandler> logger)
        {

            _leaveRequestRepository = leaveRequestRepository;
            _mapper = mapper;
            _logger = logger;
        }


        public async Task<Unit> Handle(DeleteLeaveRequestCommand request, CancellationToken cancellationToken)
        {
            // retrieve record to delete
            var leaveRequestToDelete = await _leaveRequestRepository.GetAsync(request.Id);
            // check if record exists
            if (leaveRequestToDelete == null)
            {
                _logger.LogWarning($"Leave Request with ID: {request.Id} not found.");
                throw new NotFoundException(nameof(LeaveRequest), request.Id);
            }

            // remove from the database
            _logger.LogInformation($"Deleting Leave Request with ID: {request.Id}");
            await _leaveRequestRepository.DeleteAsync(leaveRequestToDelete);
            return Unit.Value;
        }
    }
}
