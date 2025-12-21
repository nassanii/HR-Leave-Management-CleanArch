using AutoMapper;
using HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.CreateLeaveAllocation;
using HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.UpdateLeaveAllocation;
using HR.LeaveManagement.Application.Features.LeaveAllocations.Queries.DTOs;
using HR.LeaveManagement.Application.Features.LeaveType.Commands.CreateLeaveType;
using HR.LeaveManagement.Application.Features.LeaveType.Commands.UpdateLeaveType;
using HR.LeaveManagement.Application.Features.LeaveType.Queries.GetLeaveType.DTOs;
using HRLeaveManegent.Domin;
using HRLeaveManegent.Domin.Common;

namespace HR.LeaveManagement.Application.LeaveTypeProfile;

public class LeaveTypeProfile : Profile
{
    public LeaveTypeProfile()
    {
        CreateMap<LeaveTypeDTO, LeaveType>().ReverseMap();
        CreateMap<LeaveType, GetLeaveTypeDetailsDTO>().ReverseMap();
        CreateMap<CreateLeaveTypeCommand, LeaveType>().ReverseMap();
        CreateMap<UpdateLeaveTypeCommand, LeaveType>().ReverseMap();

        // leave type allocation mapping 
        CreateMap<CreateLeaveAllocationCommand, LeaveAllocation>().ReverseMap();
        CreateMap<UpdateLeaveAllocationCommand, LeaveAllocation>().ReverseMap();
        CreateMap<LeaveAllocation, LeaveAllocationDTO>().ReverseMap();
    }
}
