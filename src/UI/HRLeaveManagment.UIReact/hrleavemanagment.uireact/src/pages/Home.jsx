import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import EmployeeService from '../services/EmployeeService';
import LeaveAllocationService from '../services/LeaveAllocationService';
import LeaveRequestService from '../services/LeaveRequestService';
import LeaveTypeService from '../services/LeaveTypeService';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    employees: 0,
    allocations: 0,
    requests: 0,
    leaveTypes: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const promises = [
          LeaveRequestService.getAllLeaveRequests(),
          LeaveAllocationService.getAllAllocations(),
          LeaveTypeService.getAllLeaveTypes()
        ];

        // Only fetch employees if admin
        if (user?.role === 'Administrator') {
          promises.push(EmployeeService.getAllEmployees());
        }

        const results = await Promise.all(promises);
        
        const requests = results[0];
        const allocations = results[1];
        const types = results[2];
        const employees = user?.role === 'Administrator' ? results[3] : [];

        // Process Leave Requests to get "New" (Pending) count
        const pendingRequestsCount = requests.filter(r => r.approved === null).length;
        
        // Sort requests by DateRequested descending for Recent Activity
        const sortedRequests = [...requests].sort((a, b) => new Date(b.dateRequested) - new Date(a.dateRequested)).slice(0, 5);

        setStats({
          employees: employees.length,
          allocations: allocations.length,
          requests: pendingRequestsCount,
          leaveTypes: types.length
        });
        
        setRecentRequests(sortedRequests);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return <div className="text-center py-10">Loading Dashboard...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.firstName} {user?.lastName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user?.role === 'Administrator' && (
          <DashboardCard
            to="/employees"
            title="Employees"
            count={stats.employees}
            icon="👥"
            color="bg-blue-50 text-blue-600"
          />
        )}
        <DashboardCard
          to="/leave-allocation"
          title="Allocations"
          count={stats.allocations}
          icon="📊"
          color="bg-purple-50 text-purple-600"
        />
        <DashboardCard
          to="/leave-request"
          title="Pending Requests"
          count={stats.requests}
          icon="📨"
          color="bg-orange-50 text-orange-600"
        />
        <DashboardCard
          to="/leave-type"
          title="Leave Types"
          count={stats.leaveTypes}
          icon="⚙️"
          color="bg-teal-50 text-teal-600"
        />
      </div>

      {/* Recent Activity Table */}
      <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
        
        {recentRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">Employee</th>
                  <th scope="col" className="px-6 py-3">Dates</th>
                  <th scope="col" className="px-6 py-3">Type</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request) => (
                  <tr key={request.id} className="border-b bg-white hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                        {request.employeeName || request.requestingEmployeeId}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{request.leaveType?.name}</td>
                    <td className="px-6 py-4">
                      <StatusBadge approved={request.approved} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 text-sm">
            No recent activity to show.
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ to, title, count, icon, color }) => (
  <Link to={to} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 ${color}`}>
      {icon}
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{count}</p>
  </Link>
);

const StatusBadge = ({ approved }) => {
  let color = "bg-yellow-100 text-yellow-800";
  let text = "Pending";

  if (approved === true) {
    color = "bg-green-100 text-green-800";
    text = "Approved";
  } else if (approved === false) {
    color = "bg-red-100 text-red-800";
    text = "Rejected";
  }

  return (
    <span className={`${color} text-xs font-medium mr-2 px-2.5 py-0.5 rounded`}>
      {text}
    </span>
  );
};

export default Home;
