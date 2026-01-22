using HR.LeaveManagement.Application.Features.LeaveRequest.Commands.CancelLeaveRequest;
using HR.LeaveManagement.Application.Features.LeaveRequest.Commands.ChangeLeaveRequestApproval;
using HR.LeaveManagement.Application.Features.LeaveRequest.Commands.CreateLeaveRequest;
using HR.LeaveManagement.Application.Features.LeaveRequest.Commands.DeleteLeaveRequest;
using HR.LeaveManagement.Application.Features.LeaveRequest.Commands.UpdateLeaveRequest;
using HR.LeaveManagement.Application.Features.LeaveRequest.Queries.DTOs;
using HR.LeaveManagement.Application.Features.LeaveRequest.Queries.GetLeaveRequestById;
using HR.LeaveManagement.Application.Features.LeaveRequest.Queries.GetLeaveRequests.GetLeaveRequestList;
using MediatR;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;

namespace HRLeaveManagment.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class LeaveRequestsController : ControllerBase
{
    private readonly IMediator _mediator;

    public LeaveRequestsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET: api/<LeaveRequestsController>
    [HttpGet]
    public async Task<ActionResult<List<LeaveRequestListDTO>>> Get(bool isLoggedInUser = false)
    {
        var leaveRequests = await _mediator.Send(new GetLeaveRequestListQuery());
        return Ok(leaveRequests);
    }

    // GET api/<LeaveRequestsController>/5
    [HttpGet("{id}")]
    public async Task<ActionResult<LeaveRequestDTO>> Get(int id)
    {
        var leaveRequest = await _mediator.Send(new GetLeaveRequestByIdQuery(id));
        return Ok(leaveRequest);
    }

    // POST api/<LeaveRequestsController>
    [HttpPost]
    public async Task<ActionResult> Post([FromBody] CreateLeaveRequestCommand leaveRequest)
    {
        await _mediator.Send(leaveRequest);
        return CreatedAtAction(nameof(Get), new { }, leaveRequest);
    }

    // PUT api/<LeaveRequestsController>/5
    [HttpPut]
    public async Task<ActionResult> Put([FromBody] UpdateleaveRequestCommand leaveRequest)
    {
        await _mediator.Send(leaveRequest);
        return NoContent();
    }

    // DELETE api/<LeaveRequestsController>/5
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await _mediator.Send(new DeleteLeaveRequestCommand { Id = id });
        return NoContent();
    }

    // PUT api/<LeaveRequestsController>/CancelRequest
    [HttpPut("CancelRequest")]
    public async Task<ActionResult> CancelRequest([FromBody] CancelLeaveRequestCommand cancelLeaveRequest)
    {
        await _mediator.Send(cancelLeaveRequest);
        return NoContent();
    }

    // PUT api/<LeaveRequestsController>/UpdateApproval
    [HttpPut("UpdateApproval")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult> UpdateApproval([FromBody] ChangeLeaveRequestApprovalCommand updateApproval)
    {
        await _mediator.Send(updateApproval);
        return NoContent();
    }
}
