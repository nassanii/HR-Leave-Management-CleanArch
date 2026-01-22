using AutoMapper;
using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Exceptions;
using HRLeaveManegent.Domin;
using HRLeaveManegent.Domin.Common;
using MediatR;
using DomainLeaveType = HRLeaveManegent.Domin.LeaveType;

namespace HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.CreateLeaveAllocation
{
    public class CreateLeaveAllocationCommandHandler : IRequestHandler<CreateLeaveAllocationCommand, int>
    {
        private readonly IMapper _mapper;
        private readonly ILeaveAllocationRepository _leaveAllocationRepository;
        private readonly IGenericRepository<DomainLeaveType> _leaveTypeRepository;
        private readonly IGenericRepository<Employee> _employeeRepository;
        private readonly IAppLogger<CreateLeaveAllocationCommandHandler> _logger;
        private readonly ILeaveTypeRepository leaveTypeRepository1;

        public CreateLeaveAllocationCommandHandler(IMapper mapper,
            ILeaveAllocationRepository leaveAllocationRepository,
            IGenericRepository<DomainLeaveType> leaveTypeRepository,
            IGenericRepository<Employee> employeeRepository,
            IAppLogger<CreateLeaveAllocationCommandHandler> logger,
            ILeaveTypeRepository _leaveTypeRepository1)
        {
            _mapper = mapper;
            _leaveAllocationRepository = leaveAllocationRepository;
            _leaveTypeRepository = leaveTypeRepository;
            _employeeRepository = employeeRepository;
            _logger = logger;
            leaveTypeRepository1 = _leaveTypeRepository1;
        }

        public async Task<int> Handle(CreateLeaveAllocationCommand request, CancellationToken cancellationToken)
        {
            //validate data
            var validator = new CreateLeaveAllocationCommandValidater(leaveTypeRepository1);
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation errors occurred while creating a new leave allocation.");
                throw new BadRequestException("Validation failed.", validationResult);
            }

            // get leave type
            var leaveType = await _leaveTypeRepository.GetAsync(request.LeaveTypeId);

            // get employees
            // var employees = await _employeeRepository.GetAllAsync();
            // Filter if EmployeeId is present
            var allEmployees = await _employeeRepository.GetAllAsync();
            var employees = request.EmployeeId.HasValue
                ? allEmployees.Where(e => e.Id == request.EmployeeId.Value).ToList()
                : allEmployees;

            // get current period
            var period = DateTime.Now.Year;

            // Assign allocations for each employee
            var allocations = new List<LeaveAllocation>();
            foreach (var employee in employees)
            {
                // Check if allocation already exists
                var allocationExists = await _leaveAllocationRepository.AllocationExists(employee.IdentityId, leaveType.Id, period);
                if (!allocationExists)
                {
                    allocations.Add(new LeaveAllocation
                    {
                        EmployeeId = employee.IdentityId,
                        leaveTypeId = leaveType.Id,
                        NumberOFdayes = leaveType.DefaultDays,
                        Period = period
                    });
                }
            }


            // add to database
            foreach (var allocation in allocations)
            {
                await _leaveAllocationRepository.AddAsync(allocation);
            }

            _logger.LogInformation("Leave allocations created successfully.");
            return allocations.Count;

        }
    }
}
