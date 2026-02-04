/**
 * Theme Context
 * Manages light/dark mode with localStorage persistence
 */

import { createContext, useContext, useState, useEffect } from 'react';

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

    const isDark = theme === 'dark';

    const value = {
        theme,
        isDark,
        toggleTheme,
        setTheme: setThemeMode
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
