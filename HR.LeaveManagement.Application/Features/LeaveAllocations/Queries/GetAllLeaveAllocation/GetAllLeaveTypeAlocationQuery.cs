using HR.LeaveManagement.Application.Features.LeaveAllocations.Queries.DTOs;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveAllocations.Queries.GetAllLeaveAllocation;

public class GetAllLeaveTypeAlocationQuery : IRequest<List<LeaveAllocationDTO>>
{

}
