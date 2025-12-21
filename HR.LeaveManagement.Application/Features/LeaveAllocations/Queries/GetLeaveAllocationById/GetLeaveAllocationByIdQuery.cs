using HR.LeaveManagement.Application.Features.LeaveAllocations.Queries.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HR.LeaveManagement.Application.Features.LeaveAllocations.Queries.GetLeaveAllocationById;

public record GetLeaveAllocationByIdQuery(int Id) : IRequest<LeaveAllocationDTO>;
