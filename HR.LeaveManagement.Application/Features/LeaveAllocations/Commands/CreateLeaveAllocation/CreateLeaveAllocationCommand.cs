using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.CreateLeaveAllocation;
public class CreateLeaveAllocationCommand : IRequest<int>
{
    public int LeaveTypeId { get; set; }
    public int? EmployeeId { get; set; }
}