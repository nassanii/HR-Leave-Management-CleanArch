using HR.LeaveManagement.Application.Features.LeaveType.Queries.GetLeaveType.DTOs;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveType.Queries.GetAllLeaveType
{
    public record GetLeaveTypeByIdDetailsQuery(int Id) : IRequest<GetLeaveTypeDetailsDTO>;
}
