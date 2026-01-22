using HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.CreateLeaveAllocation;
using HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.DeleteLeaveAllocation;
using HR.LeaveManagement.Application.Features.LeaveAllocations.Commands.UpdateLeaveAllocation;
using HR.LeaveManagement.Application.Features.LeaveAllocations.Queries.DTOs;
using HR.LeaveManagement.Application.Features.LeaveAllocations.Queries.GetAllLeaveAllocation;
using HR.LeaveManagement.Application.Features.LeaveAllocations.Queries.GetLeaveAllocationById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRLeaveManagment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveTypeAllocationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public LeaveTypeAllocationController(IMediator mediator)
        {
            this._mediator = mediator;
        }

        // GET: api/<LeaveTypeAllocationController>
        [HttpGet]
        public async Task<List<LeaveAllocationDTO>> Get()
        {
            var leaveAllocations = await _mediator.Send(new GetAllLeaveTypeAlocationQuery());
            return leaveAllocations;
        }

        // GET api/<LeaveTypeAllocationController>/5
        [HttpGet("{id}")]
        public async Task<LeaveAllocationDTO> Get(int id)
        {
            var leaveAllocation = await _mediator.Send(new GetLeaveAllocationByIdQuery(id));
            return leaveAllocation;
        }

        // POST api/<LeaveTypeAllocationController>
        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Post([FromBody] CreateLeaveAllocationCommand command)
        {
            var response = await _mediator.Send(command);
            return CreatedAtAction(nameof(Get), new { id = response }, command);
        }

        // PUT api/<LeaveTypeAllocationController>/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<Unit> Put(int id, [FromBody] UpdateLeaveAllocationCommand command)
        {
            var result = await _mediator.Send(command);
            return result;
        }

        // DELETE api/<LeaveTypeAllocationController>/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<Unit> Delete(int id)
        {
            var command = new DeleteLeaveAllocationCommand { Id = id };
            var result = await _mediator.Send(command);
            return result;
        }
    }
}
