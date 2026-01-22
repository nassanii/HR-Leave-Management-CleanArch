import api from './api';

const LeaveAllocationService = {
    getAllAllocations: async () => {
        try {
            const response = await api.get('/LeaveTypeAllocation');
            return response.data;
        } catch (error) {
            console.error('Error fetching leave allocations:', error);
            throw error;
        }
    },

    getLeaveAllocationById: async (id) => {
        try {
            const response = await api.get(`/LeaveTypeAllocation/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching leave allocation with id ${id}:`, error);
            throw error;
        }
    },

    createAllocation: async (data) => {
        try {
            const response = await api.post('/LeaveTypeAllocation', data);
            return response.data;
        } catch (error) {
            console.error('Error creating leave allocation:', error);
            throw error;
        }
    },

    updateAllocation: async (id, data) => {
        try {
            const response = await api.put(`/LeaveTypeAllocation/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating leave allocation with id ${id}:`, error);
            throw error;
        }
    },

    deleteAllocation: async (id) => {
        try {
            const response = await api.delete(`/LeaveTypeAllocation/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting leave allocation with id ${id}:`, error);
            throw error;
        }
    }
};

export default LeaveAllocationService;
