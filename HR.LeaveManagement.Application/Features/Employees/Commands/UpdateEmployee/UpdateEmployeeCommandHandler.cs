using AutoMapper;
using HR.LeaveManagement.Application.Contracts.Persistence;
using HR.LeaveManagement.Application.Exceptions;
using HRLeaveManegent.Domin;
using MediatR;
using FluentValidation;

namespace HR.LeaveManagement.Application.Features.Employees.Commands.UpdateEmployee;

public class UpdateEmployeeCommandHandler : IRequestHandler<UpdateEmployeeCommand, Unit>
{
    private readonly IMapper _mapper;
    private readonly IGenericRepository<Employee> _repository;

    public UpdateEmployeeCommandHandler(IMapper mapper, IGenericRepository<Employee> repository)
    {
        _mapper = mapper;
        _repository = repository;
    }

    public async Task<Unit> Handle(UpdateEmployeeCommand request, CancellationToken cancellationToken)
    {
        var validator = new UpdateEmployeeCommandValidator(_repository);
        var validationResult = await validator.ValidateAsync(request);

        if (validationResult.Errors.Any())
            throw new BadRequestException("Invalid Employee", validationResult);

        var employeeToUpdate = await _repository.GetAsync(request.Id);

        if (employeeToUpdate == null) 
        {
             throw new NotFoundException(nameof(Employee), request.Id);
        }

        _mapper.Map(request, employeeToUpdate);

        await _repository.UpdateAsync(employeeToUpdate);

        return Unit.Value;
    }
}
