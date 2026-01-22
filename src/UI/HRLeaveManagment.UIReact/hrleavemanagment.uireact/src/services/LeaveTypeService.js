import api from './api';

const LeaveTypeService = {
    getAllLeaveTypes: async () => {
        try {
            const response = await api.get('/LeaveType');
            return response.data;
        } catch (error) {
            console.error('Error fetching leave types:', error);
            throw error;
        }
    },

    getLeaveTypeById: async (id) => {
        try {
            const response = await api.get(`/LeaveType/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching leave type with id ${id}:`, error);
            throw error;
        }
    },

    createLeaveType: async (leaveTypeData) => {
        try {
            const response = await api.post('/LeaveType', leaveTypeData);
            return response.data;
        } catch (error) {
            console.error('Error creating leave type:', error);
            throw error;
        }
    },

    updateLeaveType: async (id, leaveTypeData) => {
        try {
            const response = await api.put(`/LeaveType/${id}`, leaveTypeData);
            return response.data;
        } catch (error) {
            console.error(`Error updating leave type with id ${id}:`, error);
            throw error;
        }
    },

    deleteLeaveType: async (id) => {
        try {
            const response = await api.delete(`/LeaveType/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting leave type with id ${id}:`, error);
            throw error;
        }
    }
};

export default LeaveTypeService;
