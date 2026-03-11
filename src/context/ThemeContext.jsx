import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Determine initial dark mode state (migrating from old 'theme' string if necessary)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('isDarkMode');
        if (saved !== null) return saved === 'true';
        const legacy = localStorage.getItem('theme');
        return legacy === 'dark' || legacy === 'space';
    });

    const [bgTheme, setBgTheme] = useState(() => {
        const saved = localStorage.getItem('bgTheme');
        return saved || 'space';
    });

    const [fontStyle, setFontStyle] = useState(() => {
        const saved = localStorage.getItem('fontStyle');
        return saved || 'original';
    });

    useEffect(() => {
        // Apply Dark Mode
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

        // Apply Background Theme
        if (bgTheme === 'space') {
            document.body.classList.add('theme-space');
        } else {
            document.body.classList.remove('theme-space');
        }

        // Apply Font Style
        if (fontStyle === 'minimalistic') {
            document.body.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
            document.body.style.letterSpacing = "0";
        } else {
            // Original font Style mapping
            if (bgTheme === 'space') {
                document.body.style.fontFamily = "'Orbitron', sans-serif";
                document.body.style.letterSpacing = "0.02em";
            } else {
                document.body.style.fontFamily = "'Outfit', sans-serif";
                document.body.style.letterSpacing = "-0.01em";
            }
        }

        // Persist values
        localStorage.setItem('isDarkMode', isDarkMode);
        localStorage.setItem('bgTheme', bgTheme);
        localStorage.setItem('fontStyle', fontStyle);
    }, [isDarkMode, bgTheme, fontStyle]);

    // Legacy support for App.js check
    const isSpace = bgTheme === 'space';
    const isDark = isDarkMode;

    const value = {
        isDarkMode,
        setIsDarkMode,
        bgTheme,
        setBgTheme,
        fontStyle,
        setFontStyle,
        isDark,
        isSpace,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
