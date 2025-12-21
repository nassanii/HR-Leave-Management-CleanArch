import api from './api';

const EmployeeService = {
    // Get all employees
    getAllEmployees: async () => {
        const response = await api.get('/Employees');
        return response.data;
    },

    // Create new employee
    createEmployee: async (employee) => {
        const response = await api.post('/Employees', employee);
        return response.data;
    },

    // Update employee
    updateEmployee: async (id, employee) => {
        const response = await api.put(`/Employees/${id}`, employee);
        return response.data;
    },

    // Delete employee
    deleteEmployee: async (id) => {
        const response = await api.delete(`/Employees/${id}`);
        return response.data;
    }
};

export default EmployeeService;
