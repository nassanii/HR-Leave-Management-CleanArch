using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.UpdateLeaveAllocation;

public class UpdateLeaveAllocationCommand : IRequest<Unit>
{
    public int Id { get; set; }
    public int NumberOFdayes { get; set; }
    public int leaveTypeId { get; set; }
    public int Period { get; set; }
}
