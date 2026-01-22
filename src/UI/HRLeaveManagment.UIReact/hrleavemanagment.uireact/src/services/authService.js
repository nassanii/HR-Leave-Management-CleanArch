import axios from 'axios';

const API_URL = 'http://localhost:5293/api/Auth';

const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    // Do NOT save to localStorage - admin should stay logged in
    return response.data;
};

const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
}

const authService = {
    register,
    login,
    logout
};

export default authService;
