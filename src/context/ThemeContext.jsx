import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'space') {
            document.body.classList.add('theme-space');
        } else {
            document.body.classList.remove('theme-space');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'space';
            return 'light';
        });
    };

    const value = {
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === 'dark' || theme === 'space',
        isSpace: theme === 'space',
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
