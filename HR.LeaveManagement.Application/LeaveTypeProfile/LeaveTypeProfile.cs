using AutoMapper;
using HR.LeaveManagement.Application.Features.LeaveType.Queries.GetLeaveType.DTOs;
using HRLeaveManegent.Domin;

namespace HR.LeaveManagement.Application.LeaveTypeProfile
{
    internal class LeaveTypeProfile : Profile
    {
        public LeaveTypeProfile()
        {
            CreateMap<LeaveTypeDTO, LeaveType>().ReverseMap();
            CreateMap<LeaveType, GetLeaveTypeDetailsDTO>().ReverseMap();
        }
    }
}
