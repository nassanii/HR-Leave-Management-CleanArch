using MediatR;

namespace HR.LeaveManagement.Application.Features.Employees.Queries.GetEmployeeList;

public class GetEmployeeListQuery : IRequest<List<EmployeeListDTO>>
{
}
