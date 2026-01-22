using AutoMapper;
using HR.LeaveManagement.Application.Contracts.Persistence;
using HR.LeaveManagement.Application.Exceptions;
using HRLeaveManegent.Domin;
using MediatR;
using FluentValidation;
using HR.LeaveManagement.Application.Contracts.Identity;
using HR.LeaveManagement.Application.Models.Identity;

namespace HR.LeaveManagement.Application.Features.Employees.Commands.CreateEmployee;

public class CreateEmployeeCommandHandler : IRequestHandler<CreateEmployeeCommand, int>
{
    private readonly IMapper _mapper;
    private readonly IGenericRepository<Employee> _repository;
    private readonly IAuthService _authService;

    public CreateEmployeeCommandHandler(IMapper mapper, IGenericRepository<Employee> repository, IAuthService authService)
    {
        _mapper = mapper;
        _repository = repository;
        _authService = authService;
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
        
        if (string.IsNullOrEmpty(request.IdentityId))
        {
            // Create Identity User (Only if not provided by caller, e.g. AuthController)
            var registrationRequest = new RegistrationRequest
            {
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                UserName = request.Email,
                Password = request.Password,
                Role = "Employee"
            };

            try 
            {
                var registrationResponse = await _authService.Register(registrationRequest);
                employee.IdentityId = registrationResponse.UserId;
            }
            catch (Exception)
            {
                // Registration failed, likely because user exists. Try to find existing user.
                var existingUserId = await _authService.GetUserId(request.Email);
                if (!string.IsNullOrEmpty(existingUserId))
                {
                    employee.IdentityId = existingUserId;
                }
                else
                {
                    throw; // Rethrow if we can't find the user either
                }
            }
        }
        else 
        {
            employee.IdentityId = request.IdentityId;
        }

        await _repository.AddAsync(employee);
        return employee.Id;
    }
}
