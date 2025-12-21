using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.DeleteLeaveAllocation;

public class DeleteLeaveAllocationCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
