using AutoMapper;
using HR.LeaveManagement.Application.Contracts.Persistence;
using HR.LeaveManagement.Application.Exceptions;
using HRLeaveManegent.Domin;
using MediatR;
using FluentValidation;

namespace HR.LeaveManagement.Application.Features.Employees.Commands.CreateEmployee;

public class CreateEmployeeCommandHandler : IRequestHandler<CreateEmployeeCommand, int>
{
    private readonly IMapper _mapper;
    private readonly IGenericRepository<Employee> _repository;

    public CreateEmployeeCommandHandler(IMapper mapper, IGenericRepository<Employee> repository)
    {
        _mapper = mapper;
        _repository = repository;
    }

    public async Task<int> Handle(CreateEmployeeCommand request, CancellationToken cancellationToken)
    {
        var validator = new CreateEmployeeCommandValidator();
        var validationResult = await validator.ValidateAsync(request);

        if (validationResult.Errors.Any())
            throw new BadRequestException("Invalid Employee", validationResult);

        var employee = _mapper.Map<Employee>(request);
        
        // Postgres requires UTC
        employee.DateJoined = DateTime.SpecifyKind(employee.DateJoined, DateTimeKind.Utc);
        if (employee.DateOfBirth.HasValue)
        {
            employee.DateOfBirth = DateTime.SpecifyKind(employee.DateOfBirth.Value, DateTimeKind.Utc);
        }
        
        await _repository.AddAsync(employee);
        return employee.Id;
    }
}
