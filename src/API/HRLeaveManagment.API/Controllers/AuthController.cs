using HR.LeaveManagement.Application.Contracts.Identity;
using HR.LeaveManagement.Application.Models.Identity;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using HR.LeaveManagement.Application.Features.Employees.Commands.CreateEmployee;

namespace HRLeaveManagment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authenticationService;
        private readonly IMediator _mediator;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authenticationService, IMediator mediator, ILogger<AuthController> logger)
        {
            _authenticationService = authenticationService;
            _mediator = mediator;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(AuthRequest request)
        {
            return Ok(await _authenticationService.Login(request));
        }

        [HttpPost("register")]
        public async Task<ActionResult<RegistrationResponse>> Register(RegistrationRequest request)
        {
            try
            {
                _logger.LogInformation("Register endpoint called for email: {Email}", request.Email);
                
                var response = await _authenticationService.Register(request);
                _logger.LogInformation("Identity User created with ID: {UserId}", response.UserId);

                var createEmployeeCommand = new CreateEmployeeCommand
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    DateJoined = DateTime.UtcNow,

                    IdentityId = response.UserId
                };

                _logger.LogInformation("Sending CreateEmployeeCommand for IdentityId: {IdentityId}", response.UserId);
                await _mediator.Send(createEmployeeCommand);
                _logger.LogInformation("CreateEmployeeCommand succeeded.");

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration failed: {Message}", ex.Message);
                // Return the specific error message to the client for debugging
                return BadRequest(new { Message = ex.Message, Details = ex.InnerException?.Message });
            }
        }
    }
}
