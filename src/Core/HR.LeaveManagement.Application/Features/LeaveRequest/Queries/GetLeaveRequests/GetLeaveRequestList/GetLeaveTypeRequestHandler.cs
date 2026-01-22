using AutoMapper;
using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Features.LeaveRequest.Queries.DTOs;
using HR.LeaveManagement.Application.Contracts.Identity;
using MediatR;

namespace HR.LeaveManagement.Application.Features.LeaveRequest.Queries.GetLeaveRequests.GetLeaveRequestList;

public class GetLeaveRequestListHandler : IRequestHandler<GetLeaveRequestListQuery, List<LeaveRequestListDTO>>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly IMapper _mapper;
    private readonly IAppLogger<GetLeaveRequestListHandler> _logger;
    private readonly IUserService _userService;

    public GetLeaveRequestListHandler(ILeaveRequestRepository leaveRequestRepository, IMapper mapper, IAppLogger<GetLeaveRequestListHandler> logger, IUserService userService)
    {
        this._leaveRequestRepository = leaveRequestRepository;
        _mapper = mapper;
        _logger = logger;
        _userService = userService;
    }

    public async Task<List<LeaveRequestListDTO>> Handle(GetLeaveRequestListQuery request, CancellationToken cancellationToken)
    {
        // Get current user ID
        var currentUserId = _userService.UserId;
        
        // Check if user is admin
        var isAdmin = !string.IsNullOrEmpty(currentUserId) && await _userService.IsInRoleAsync(currentUserId, "Administrator");

        var leaveRequests = await _leaveRequestRepository.GetLeaveRequestsWithDetails();

        // Filter requests based on role
        if (!isAdmin && !string.IsNullOrEmpty(currentUserId))
        {
            // Regular employees see only their own requests
            leaveRequests = leaveRequests.Where(lr => lr.RequestingEmployeeId == currentUserId).ToList();
            _logger.LogInformation($"Filtered leave requests for employee {currentUserId}");
        }
        else if (isAdmin)
        {
            _logger.LogInformation("Admin user - showing all leave requests");
        }

        var leaveRequestsDTOs = _mapper.Map<List<LeaveRequestListDTO>>(leaveRequests);
        
        var employees = await _userService.GetEmployees();
        
        foreach (var req in leaveRequestsDTOs)
        {
            var employee = employees.FirstOrDefault(q => q.Id == req.RequestingEmployeeId);
            if (employee != null)
            {
                req.EmployeeName = $"{employee.FirstName} {employee.LastName}";
            }
        }

        _logger.LogInformation("Retrieved all leave requests successfully.");

        return leaveRequestsDTOs;
    }
}
