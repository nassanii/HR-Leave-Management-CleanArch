using AutoMapper;
using HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.UpdateLeaveAllocation;
using HR.LeaveManagement.Application.Features.LeaveRequest.Commands.CreateLeaveRequest;
using HR.LeaveManagement.Application.Features.LeaveRequest.Queries.DTOs;
using HRLeaveManegent.Domin;

namespace HR.LeaveManagement.Application.Mapping;

public class LeaveTypeRequestProfile : Profile
{
    public LeaveTypeRequestProfile()
    {
        CreateMap<LeaveRequest, LeaveRequestListDTO>().ReverseMap();
        CreateMap<UpdateLeaveAllocationCommand, LeaveRequest>().ReverseMap();
        CreateMap<CreateLeaveRequestCommand, LeaveRequest>().ReverseMap();
    }
}
