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

import Home from './pages/Home';

export default App
