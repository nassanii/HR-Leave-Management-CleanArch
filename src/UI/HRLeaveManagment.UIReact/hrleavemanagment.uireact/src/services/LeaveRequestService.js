import api from './api';

const LeaveRequestService = {
    // Get all leave requests
    getAllLeaveRequests: async () => {
        const response = await api.get('/LeaveRequests');
        return response.data;
    },

    // Get specific leave request
    getLeaveRequestById: async (id) => {
        const response = await api.get(`/LeaveRequests/${id}`);
        return response.data;
    },

    // Create new leave request
    createLeaveRequest: async (leaveRequest) => {
        const response = await api.post('/LeaveRequests', leaveRequest);
        return response.data;
    },

    // Update leave request (generic)
    updateLeaveRequest: async (leaveRequest) => {
        const response = await api.put('/LeaveRequests', leaveRequest);
        return response.data;
    },

    // Delete leave request
    deleteLeaveRequest: async (id) => {
        await api.delete(`/LeaveRequests/${id}`);
    },

    // Cancel leave request
    cancelLeaveRequest: async (id) => {
        const payload = { id };
        await api.put('/LeaveRequests/CancelRequest', payload);
    },

    // Update approval status (for admin/approver)
    changeApprovalStatus: async (id, approved) => {
        const payload = { id, approved };
        await api.put('/LeaveRequests/UpdateApproval', payload);
    }
};

export default LeaveRequestService;
