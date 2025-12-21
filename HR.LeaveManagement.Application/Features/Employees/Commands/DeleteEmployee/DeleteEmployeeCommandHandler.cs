using HR.LeaveManagement.Application.Contracts.Persistence;
using HR.LeaveManagement.Application.Exceptions;
using HRLeaveManegent.Domin;
using MediatR;
using FluentValidation;

namespace HR.LeaveManagement.Application.Features.Employees.Commands.DeleteEmployee;

public class DeleteEmployeeCommandHandler : IRequestHandler<DeleteEmployeeCommand, Unit>
{
    private readonly IGenericRepository<Employee> _repository;

    public DeleteEmployeeCommandHandler(IGenericRepository<Employee> repository)
    {
        _repository = repository;
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

        await _repository.DeleteAsync(employee);
        
        return Unit.Value;
    }
}
