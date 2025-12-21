import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LeaveType from './pages/LeaveType';
import LeaveAllocation from './pages/LeaveAllocation';
import LeaveRequest from './pages/LeaveRequest';
import Employees from './pages/Employees';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LeaveType />} />
        <Route path="/leavetypes" element={<LeaveType />} />
        <Route path="/leave-allocation" element={<LeaveAllocation />} />
        <Route path="/leave-requests" element={<LeaveRequest />} />
        <Route path="/employees" element={<Employees />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
