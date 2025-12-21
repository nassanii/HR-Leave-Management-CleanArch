using HR.LeaveManagement.Application.Features.LeaveType.Commands.CreateLeaveType;
using HR.LeaveManagement.Application.Features.LeaveType.Commands.DeleteLeaveType;
using HR.LeaveManagement.Application.Features.LeaveType.Commands.UpdateLeaveType;
using HR.LeaveManagement.Application.Features.LeaveType.Queries.GetAllLeaveType;
using HR.LeaveManagement.Application.Features.LeaveType.Queries.GetLeaveType.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HRLeaveManagment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveTypeController : ControllerBase
    {
        private readonly IMediator _mediator;

        public LeaveTypeController(IMediator mediator)
        {
            this._mediator = mediator;
        }

        // GET: api/<LeaveTypeController>
        [HttpGet]
        public async Task<List<LeaveTypeDTO>> Get()
        {
            var leaveTypes = await _mediator.Send(new GetLeaveTypeQuery());
            return leaveTypes;
        }

        // GET api/<LeaveTypeController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GetLeaveTypeDetailsDTO>> Get(int id)
        {
            var leaveTypeById = await _mediator.Send(new GetLeaveTypeByIdDetailsQuery(id));

            if (leaveTypeById == null)
                return NotFound();

            return Ok(leaveTypeById);
        }


        // POST api/<LeaveTypeController>
        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        public async Task<ActionResult> Post([FromBody] CreateLeaveTypeCommand command)
        {
            var response = await _mediator.Send(command);
            return CreatedAtAction(nameof(Get), new { id = response }, response);
        }

        // PUT api/<LeaveTypeController>/5
        // PUT api/<LeaveTypeController>/5
        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesDefaultResponseType]
        public async Task<Unit> Put(int id, [FromBody] UpdateLeaveTypeCommand command)
        {
            // Ensure the ID in the URL overrides/matches the command
            command.Id = id;
            var response = await _mediator.Send(command);
            return response;
        }

        // DELETE api/<LeaveTypeController>/5
        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<Unit> Delete(int id)
        {
            var command = new DeleteLeaveTypeCommand { Id = id };
            await _mediator.Send(command);
            return Unit.Value;
        }
    }
}
