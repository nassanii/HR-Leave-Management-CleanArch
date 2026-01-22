using HR.LeaveManagement.Application.Contracts.Persistence;
using HR.LeaveManagement.Application.Exceptions;
using HRLeaveManegent.Domin;
using MediatR;
using FluentValidation;

namespace HR.LeaveManagement.Application.Features.Employees.Commands.DeleteEmployee;

using HR.LeaveManagement.Application.Contracts.Identity;
using Microsoft.Extensions.Logging;

public class DeleteEmployeeCommandHandler : IRequestHandler<DeleteEmployeeCommand, Unit>
{
    private readonly IGenericRepository<Employee> _repository;
    private readonly ILeaveAllocationRepository _leaveAllocationRepository;
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly IAuthService _authService;
    private readonly ILogger<DeleteEmployeeCommandHandler> _logger;

    public DeleteEmployeeCommandHandler(IGenericRepository<Employee> repository,
        ILeaveAllocationRepository leaveAllocationRepository,
        ILeaveRequestRepository leaveRequestRepository,
        IAuthService authService,
        ILogger<DeleteEmployeeCommandHandler> logger)
    {
        _repository = repository;
        _leaveAllocationRepository = leaveAllocationRepository;
        _leaveRequestRepository = leaveRequestRepository;
        _authService = authService;
        _logger = logger;
    }

    public async Task<Unit> Handle(DeleteEmployeeCommand request, CancellationToken cancellationToken)
    {
        var validator = new DeleteEmployeeCommandValidator();
        var validationResult = await validator.ValidateAsync(request);
        
        if (validationResult.Errors.Any())
            throw new BadRequestException("Invalid Employee Delete Request", validationResult);

        var employee = await _repository.GetAsync(request.Id);
        
        if (employee == null)
        {
            throw new NotFoundException(nameof(Employee), request.Id);
        }

        // Cascade delete allocations and requests if IdentityId is present
        if (!string.IsNullOrEmpty(employee.IdentityId))
        {
            _logger.LogInformation("Deleting employee {EmployeeId} with IdentityId {IdentityId}", employee.Id, employee.IdentityId);
            
            // Delete Allocations
            _logger.LogInformation("Deleting allocations for employee {IdentityId}", employee.IdentityId);
            await _leaveAllocationRepository.DeleteAllocations(employee.IdentityId);
            _logger.LogInformation("Successfully deleted allocations for employee {IdentityId}", employee.IdentityId);

            // Delete Requests
            _logger.LogInformation("Deleting requests for employee {IdentityId}", employee.IdentityId);
            await _leaveRequestRepository.DeleteRequests(employee.IdentityId);
            _logger.LogInformation("Successfully deleted requests for employee {IdentityId}", employee.IdentityId);

            // Delete Identity User
            _logger.LogInformation("Deleting identity user {IdentityId}", employee.IdentityId);
            await _authService.DeleteUser(employee.IdentityId);
            _logger.LogInformation("Successfully deleted identity user {IdentityId}", employee.IdentityId);
        }

        await _repository.DeleteAsync(employee);
        
        return Unit.Value;
    }
}
