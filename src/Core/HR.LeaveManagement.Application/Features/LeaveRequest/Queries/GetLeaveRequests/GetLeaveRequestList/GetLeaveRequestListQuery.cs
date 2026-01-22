using HR.LeaveManagement.Application.Features.LeaveRequest.Queries.DTOs;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveRequest.Queries.GetLeaveRequests.GetLeaveRequestList;

public record GetLeaveRequestListQuery : IRequest<List<LeaveRequestListDTO>>;

