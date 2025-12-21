using AutoMapper;
using HR.LeaveManagement.Application.Features.Employees.Commands.CreateEmployee;
using HR.LeaveManagement.Application.Features.Employees.Commands.UpdateEmployee;
using HR.LeaveManagement.Application.Features.Employees.Queries.GetEmployeeList;
using HRLeaveManegent.Domin;

namespace HR.LeaveManagement.Application.Mapping;

public class EmployeeProfile : Profile
{
    public EmployeeProfile()
    {
        CreateMap<Employee, EmployeeListDTO>().ReverseMap();
        CreateMap<CreateEmployeeCommand, Employee>();
        CreateMap<UpdateEmployeeCommand, Employee>();
    }
}
