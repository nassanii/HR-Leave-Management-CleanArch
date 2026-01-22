using AutoMapper;
using HR.LeaveManagement.Application.Contracts.ILogging;
using HR.LeaveManagement.Application.Features.LeaveAllocations.Queries.DTOs;
using HR.LeaveManagement.Application.Contracts.Identity;
using MediatR;
using HR.LeaveManagement.Application.Contracts.Persistence; // Assuming this namespace for Repositories

namespace HR.LeaveManagement.Application.Features.LeaveAllocations.Queries.GetAllLeaveAllocation;

public class GetAllLeaveTypeAlocationHandler : IRequestHandler<GetAllLeaveTypeAlocationQuery, List<LeaveAllocationDTO>>
{
    private readonly IMapper _mapper;
    private readonly ILeaveAllocationRepository _leaveAllocationRepository;
    private readonly IAppLogger<GetAllLeaveTypeAlocationHandler> _logger;
    private readonly IUserService _userService;
    private readonly ILeaveRequestRepository _leaveRequestRepository;

    public GetAllLeaveTypeAlocationHandler(
        IMapper mapper, 
        ILeaveAllocationRepository leaveAllocationRepository, 
        IAppLogger<GetAllLeaveTypeAlocationHandler> logger, 
        IUserService userService, 
        ILeaveRequestRepository leaveRequestRepository)
    {
        _mapper = mapper;
        _leaveAllocationRepository = leaveAllocationRepository;
        _logger = logger;
        _userService = userService;
        _leaveRequestRepository = leaveRequestRepository;
    }

    public async Task<List<LeaveAllocationDTO>> Handle(GetAllLeaveTypeAlocationQuery request, CancellationToken cancellationToken)
    {
        // 1. Get current user ID
        var currentUserId = _userService.UserId;
        
        // 2. Check if user is admin
        var isAdmin = !string.IsNullOrEmpty(currentUserId) && await _userService.IsInRoleAsync(currentUserId, "Administrator");

        // 3. Get allocations from DB
        var leaveAllocations = await _leaveAllocationRepository.GetLeaveAllocationsWithDetails();
        
        // 4. Filter allocations based on role
        if (!isAdmin && !string.IsNullOrEmpty(currentUserId))
        {
            // Regular employees see only their own allocations
            leaveAllocations = leaveAllocations.Where(la => la.EmployeeId == currentUserId).ToList();
            _logger.LogInformation($"Filtered leave allocations for employee {currentUserId}");
        }
        else if (isAdmin)
        {
            _logger.LogInformation("Admin user - showing all leave allocations");
        }

        // 5. Map to DTOs
        var leaveAllocationDtos = _mapper.Map<List<LeaveAllocationDTO>>(leaveAllocations);
        
        // 6. GetData for enrichment (Employees & Requests)
        var employees = await _userService.GetEmployees();
        var allLeaveRequests = await _leaveRequestRepository.GetLeaveRequestsWithDetails();
        
        // 7. Loop to fix data
        foreach (var alloc in leaveAllocationDtos)
        {
            // A. Set Employee Name
            var employee = employees.FirstOrDefault(q => q.Id == alloc.EmployeeId);
            if (employee != null)
            {
                alloc.EmployeeName = $"{employee.FirstName} {employee.LastName}";
            }
            
            // B. Calculate Used Days (Approved requests in the same period)
            var approvedRequests = allLeaveRequests
                .Where(lr => lr.RequestingEmployeeId == alloc.EmployeeId 
                          && lr.LeaveTypeId == alloc.leaveTypeId 
                          && lr.Approved == true
                          && lr.StartDate.Year == alloc.Period)
                .ToList();
            
            // Note: This sums calendar days. Consider excluding weekends if required.
            var usedDays = approvedRequests.Sum(lr => (lr.EndDate - lr.StartDate).Days + 1);
            
            // C. LOGIC FIX HERE / تصحيح المنطق هنا
            
            // Store the value from DB as the Current Balance
            // نعتبر القيمة القادمة من قاعدة البيانات هي الرصيد المتبقي
            var currentBalance = alloc.NumberOFdayes;
            
            // Reconstruct the Total Original Allocation
            // نعيد حساب الإجمالي الأصلي بجمع الرصيد المتبقي + الأيام التي تم استخدامها
            var totalOriginalAllocation = currentBalance + usedDays;

            // Update the DTO properties
            alloc.Balance = currentBalance;            // الرصيد = القيمة من الداتابيس
            alloc.NumberOFdayes = totalOriginalAllocation; // الأيام الكلية = الرصيد + المستهلك
        }
        
        return leaveAllocationDtos;
    }
}