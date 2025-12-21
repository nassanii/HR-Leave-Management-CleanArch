using AutoMapper;
using HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.CreateLeaveAllocation;
using HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.UpdateLeaveAllocation;
using HR.LeaveManagement.Application.Features.LeaveAllocations.Queries.DTOs;
using HRLeaveManegent.Domin.Common;

namespace HR.LeaveManagement.Application.LeaveTypeProfile;

public class LeaveTypeAllocationProfile : Profile
{
    public LeaveTypeAllocationProfile()
    {


        // leave type allocation mapping 
        CreateMap<CreateLeaveAllocationCommand, LeaveAllocation>().ReverseMap();
        CreateMap<UpdateLeaveAllocationCommand, LeaveAllocation>().ReverseMap();
        CreateMap<LeaveAllocation, LeaveAllocationDTO>().ReverseMap();
    }
}


