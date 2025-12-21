import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Optionally validate token or fetch user details here
            // For now, we'll assume the token implies a logged-in state
            // You might want to decode the JWT to get user info
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, id, userName, email: userEmail, roles } = response.data;
            localStorage.setItem('token', token);
            setUser({ id, userName, email: userEmail, roles, token });
            return { success: true };
        } catch (error) {
            console.error("Login call failed", error);
            // Return more specific error info if available
            return { success: false, error: error.response?.data?.title || "Login failed" };
        }
    };

    const register = async (userData) => {
        try {
            await api.post('/auth/register', userData);
            return { success: true };
        } catch (error) {
            console.error("Register call failed", error);
            return { success: false, error: error.response?.data?.errors || "Registration failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
