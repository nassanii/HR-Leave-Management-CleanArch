using AutoMapper;
using HR.LeaveManagement.Application.Contracts.Persistence;
using HRLeaveManegent.Domin;
using MediatR;

namespace HR.LeaveManagement.Application.Features.Employees.Queries.GetEmployeeList;

public class GetEmployeeListQueryHandler : IRequestHandler<GetEmployeeListQuery, List<EmployeeListDTO>>
{
    private readonly IGenericRepository<Employee> _repository;
    private readonly IMapper _mapper;

    public GetEmployeeListQueryHandler(IGenericRepository<Employee> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<List<EmployeeListDTO>> Handle(GetEmployeeListQuery request, CancellationToken cancellationToken)
    {
        var employees = await _repository.GetAllAsync();
        return _mapper.Map<List<EmployeeListDTO>>(employees);
    }
}
