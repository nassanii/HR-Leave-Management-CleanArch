import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthLayout from './components/AuthLayout';
import MainLayout from './components/MainLayout';
import Employees from './pages/Employees';
import LeaveAllocation from './pages/LeaveAllocation';
import LeaveRequest from './pages/LeaveRequest';
import LeaveType from './pages/LeaveType';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected/Main Application Routes */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
          <Route path="/leave-allocation" element={<ProtectedRoute><LeaveAllocation /></ProtectedRoute>} />
          <Route path="/leave-request" element={<ProtectedRoute><LeaveRequest /></ProtectedRoute>} />
          <Route path="/leave-type" element={<ProtectedRoute><LeaveType /></ProtectedRoute>} />
          <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
};

const Home = () => {
  const { user } = useContext(AuthContext);

  // Dashboard View (Protected)
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
            count="12"
            icon="👥"
            color="bg-blue-50 text-blue-600"
          />
        )}
        <DashboardCard
          to="/leave-allocation"
          title="Allocations"
          count="Pending"
          icon="📊"
          color="bg-purple-50 text-purple-600"
        />
        <DashboardCard
          to="/leave-request"
          title="Requests"
          count="3 New"
          icon="📨"
          color="bg-orange-50 text-orange-600"
        />
        <DashboardCard
          to="/leave-type"
          title="Leave Types"
          count="Configure"
          icon="⚙️"
          color="bg-teal-50 text-teal-600"
        />
      </div>

      {/* Placeholder for Recent Activity Table */}
      <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-gray-400 text-sm">
          No recent activity to show.
        </div>
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

export default App
