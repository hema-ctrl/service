import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Auto-login on refresh
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            // Do not auto-login after registration
            // localStorage.setItem('user', JSON.stringify(data));
            // setUser(data);
            return { success: true };
        } catch (error) {
            console.error('Registration error:', error.response?.data?.message || error.message);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        // Optional: reload page to clear any in-memory states
        // window.location.reload(); 
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
