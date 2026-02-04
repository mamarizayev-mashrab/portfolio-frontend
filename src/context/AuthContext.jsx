/**
 * Auth Context
 * Manages admin authentication with JWT
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('portfolio-token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is authenticated
    const isAuthenticated = !!token && !!user;

    // Verify token and get user on mount
    useEffect(() => {
        const verifyAuth = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/auth/me');
                setUser(response.data.data);
            } catch (err) {
                // Token invalid or expired
                localStorage.removeItem('portfolio-token');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, [token]);

    // Login
    const login = useCallback(async (email, password) => {
        setError(null);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token: newToken, user: userData } = response.data.data;

            localStorage.setItem('portfolio-token', newToken);
            setToken(newToken);
            setUser(userData);

            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, message };
        }
    }, []);

    // Logout
    const logout = useCallback(() => {
        localStorage.removeItem('portfolio-token');
        setToken(null);
        setUser(null);
    }, []);

    // Change password
    const changePassword = useCallback(async (currentPassword, newPassword) => {
        setError(null);
        try {
            const response = await api.post('/auth/change-password', {
                currentPassword,
                newPassword
            });

            // Update token if new one is returned
            if (response.data.data?.token) {
                localStorage.setItem('portfolio-token', response.data.data.token);
                setToken(response.data.data.token);
            }

            return { success: true, message: response.data.message };
        } catch (err) {
            const message = err.response?.data?.message || 'Password change failed';
            setError(message);
            return { success: false, message };
        }
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value = {
        user,
        token,
        loading,
        error,
        isAuthenticated,
        login,
        logout,
        changePassword,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
