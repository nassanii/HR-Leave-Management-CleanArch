using HR.LeaveManagement.Application.Features.Employees.Commands.CreateEmployee;
using HR.LeaveManagement.Application.Features.Employees.Commands.UpdateEmployee;
using HR.LeaveManagement.Application.Features.Employees.Commands.DeleteEmployee;
using HR.LeaveManagement.Application.Features.Employees.Queries.GetEmployeeList;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRLeaveManagment.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EmployeesController : ControllerBase
{
    private readonly IMediator _mediator;

    private readonly ILogger<EmployeesController> _logger;

    public EmployeesController(IMediator mediator, ILogger<EmployeesController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    // GET: api/<EmployeesController>
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<EmployeeListDTO>>> Get()
    {
        _logger.LogInformation("Getting all employees...");
        var employees = await _mediator.Send(new GetEmployeeListQuery());
        _logger.LogInformation("Retrieved {Count} employees", employees.Count);
        return Ok(employees);
    }

    // POST api/<EmployeesController>
    [HttpPost]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult> Post([FromBody] CreateEmployeeCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(Get), new { id = id }, command);
    }

    // PUT api/<EmployeesController>/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult> Put(int id, [FromBody] UpdateEmployeeCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }
        await _mediator.Send(command);
        return NoContent();
    }

    // DELETE api/<EmployeesController>/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult> Delete(int id)
    {
        await _mediator.Send(new DeleteEmployeeCommand { Id = id });
        return NoContent();
    }
}
