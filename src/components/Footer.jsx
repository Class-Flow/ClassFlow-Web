import { useLocation } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const location = useLocation();

    // Hide footer on public onboarding/landing pages
    const hideOnPaths = ['/welcome', '/ready', '/auth', '/forgot-password', '/otp', '/onboarding', '/org-pro'];
    if (hideOnPaths.includes(location.pathname)) return null;

    return (
        <footer style={{
            textAlign: 'center',
            padding: '20px',
            color: 'var(--text-tertiary)',
            fontSize: '0.85rem',
            marginTop: 'auto',
            marginBottom: '80px' // Space for bottom nav
        }}>
            <p>&copy; {currentYear} ClassFlow. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
