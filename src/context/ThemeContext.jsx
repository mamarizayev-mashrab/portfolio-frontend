/**
 * Theme Context
 * Manages light/dark mode and primary color with localStorage persistence
 */

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Initialize theme from localStorage or default to 'dark'
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('portfolio-theme');
            return savedTheme || 'dark';
        }
        return 'dark';
    });

    // Update document class and localStorage when theme changes
    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;

        if (theme === 'dark') {
            root.classList.add('dark');
            body.classList.remove('light');
        } else {
            root.classList.remove('dark');
            body.classList.add('light');
        }

        localStorage.setItem('portfolio-theme', theme);
    }, [theme]);

    // Initial load for primary color
    useEffect(() => {
        const initTheme = async () => {
            // 1. Try local storage first (instant)
            const savedColor = localStorage.getItem('portfolio-primary-color');
            if (savedColor) {
                document.documentElement.style.setProperty('--primary', savedColor);
                document.documentElement.style.setProperty('--selection', savedColor);
            }

            // 2. Fetch from backend to sync (in case changed on another device)
            try {
                // Use configured api instance
                const response = await api.get('/settings');
                if (response.data.data?.theme?.primaryColor) {
                    const backendColor = response.data.data.theme.primaryColor;
                    if (backendColor !== savedColor) {
                        document.documentElement.style.setProperty('--primary', backendColor);
                        document.documentElement.style.setProperty('--selection', backendColor);
                        localStorage.setItem('portfolio-primary-color', backendColor);
                    }
                }
                if (response.data.data?.theme?.defaultMode) {
                    // We could enforce backend theme here, but user local preference is usually better
                    // setTheme(response.data.data.theme.defaultMode);
                }
            } catch (error) {
                // Defines default if nothing else
                if (!savedColor) {
                    document.documentElement.style.setProperty('--primary', '#a855f7');
                }
            }
        };

        initTheme();
    }, []);

    // Toggle between light and dark
    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // Set specific theme
    const setThemeMode = (mode) => {
        if (mode === 'light' || mode === 'dark') {
            setTheme(mode);
        }
    };

    const setPrimaryColor = (color) => {
        document.documentElement.style.setProperty('--primary', color);
        document.documentElement.style.setProperty('--selection', color);
        localStorage.setItem('portfolio-primary-color', color);
    };

    const isDark = theme === 'dark';

    const value = {
        theme,
        isDark,
        toggleTheme,
        setTheme: setThemeMode,
        setPrimaryColor
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
