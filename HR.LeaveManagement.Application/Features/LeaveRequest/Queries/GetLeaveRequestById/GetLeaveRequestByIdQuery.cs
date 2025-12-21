using HR.LeaveManagement.Application.Features.LeaveRequest.Queries.DTOs;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveRequest.Queries.GetLeaveRequestById
{
    public record GetLeaveRequestByIdQuery(int Id) : IRequest<LeaveRequestDTO>;

}
