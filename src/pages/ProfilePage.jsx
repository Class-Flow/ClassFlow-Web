import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedAvatar from '../components/AnimatedAvatar';
import AvatarCustomizer from '../components/AvatarCustomizer';
import { useTheme } from '../context/ThemeContext';
import {
    HiOutlineUser,
    HiOutlineAcademicCap,
    HiOutlineCalendar,
    HiOutlineOfficeBuilding,
    HiOutlineMoon,
    HiOutlineSun,
    HiOutlineLogout,
    HiOutlineChevronRight,
    HiOutlineColorSwatch,
    HiOutlineLightningBolt,
    HiOutlineViewGrid,
    HiOutlineCollection,
    HiOutlineDatabase,
    HiOutlineBell,
    HiOutlineClock,
    HiOutlineMicrophone,
    HiOutlineInformationCircle,
    HiOutlineQuestionMarkCircle,
    HiOutlineShieldCheck,
    HiOutlineFire
} from 'react-icons/hi';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, logout, updateUser } = useAuth();
    const { theme, isDark, toggleTheme, isSpace } = useTheme();

    // Avatar customizer state
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    // Fallback initials
    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
    };

    const sections = [
        {
            title: 'Personal Information',
            items: [
                { label: 'Name', value: user?.name || 'User', icon: HiOutlineUser },
                { label: 'Role', value: user?.role || 'Student', icon: HiOutlineAcademicCap },
                { label: 'Semester', value: 'Spring 2026', icon: HiOutlineCalendar },
                { label: 'Institution', value: 'University Name', icon: HiOutlineOfficeBuilding },
            ]
        },
        {
            title: 'Appearance',
            items: [
                { id: 'timeline', label: 'My Timeline', type: 'link', icon: HiOutlineClock, path: '/timeline' },
                { id: 'dark-mode', label: 'Theme Mode', subLabel: `Current: ${theme.charAt(0).toUpperCase() + theme.slice(1)} (Cycle)`, type: 'toggle', icon: isSpace ? HiOutlineLightningBolt : HiOutlineMoon },
                { id: 'color-theme', label: 'Color Theme', value: 'Professional', type: 'value', icon: HiOutlineColorSwatch },
                { id: 'reduced-animations', label: 'Reduced Animations', subLabel: 'Minimize visual effects', type: 'toggle', icon: HiOutlineLightningBolt },
            ]
        },
        {
            title: 'Security',
            items: [
                { id: 'mfa-enabled', label: 'Enable MFA', subLabel: 'Multi-factor authentication via Email OTP', type: 'toggle', icon: HiOutlineShieldCheck }
            ]
        },
        {
            title: 'Workflow',
            items: [
                { id: 'default-view', label: 'Default View', value: 'Home', type: 'value', icon: HiOutlineViewGrid },
                { id: 'study-mode', label: 'Study Mode', subLabel: 'Minimal interface during focus time', type: 'toggle', icon: HiOutlineFire },
            ]
        },
        {
            title: 'Data & Categories',
            items: [
                { id: 'organization', label: 'Organization', subLabel: 'University details', type: 'link', icon: HiOutlineOfficeBuilding, path: '/organization' },
                { id: 'manage-categories', label: 'Manage Categories', subLabel: '5 categories', type: 'link', icon: HiOutlineCollection, path: '/categories' },
                { id: 'export-data', label: 'Export Data', subLabel: 'Backup your events', type: 'link', icon: HiOutlineDatabase },
            ]
        },
        {
            title: 'Notifications',
            items: [
                { id: 'event-reminders', label: 'Event Reminders', type: 'toggle', icon: HiOutlineBell, defaultActive: true },
                { id: 'deadline-alerts', label: 'Deadline Alerts', type: 'toggle', icon: HiOutlineClock, defaultActive: true },
                { id: 'voice-note-notifications', label: 'Voice Note Notifications', type: 'toggle', icon: HiOutlineMicrophone },
            ]
        },
        {
            title: 'About',
            items: [
                { id: 'version', label: 'Version', value: '1.0.0', type: 'simple', icon: HiOutlineInformationCircle },
                { id: 'help', label: 'Help & Support', type: 'link', icon: HiOutlineQuestionMarkCircle },
                { id: 'privacy', label: 'Privacy Policy', type: 'link', icon: HiOutlineShieldCheck, path: '/privacy' },
            ]
        }
    ];

    const [toggles, setToggles] = useState({
        'reduced-animations': false,
        'study-mode': false,
        'event-reminders': true,
        'deadline-alerts': true,
        'voice-note-notifications': false,
        'mfa-enabled': user?.settings?.mfaEnabled ?? true
    });

    const handleToggle = (id) => {
        if (id === 'dark-mode') {
            toggleTheme();
        } else {
            setToggles(prev => ({ ...prev, [id]: !prev[id] }));
        }
    };

    return (
        <div className="profile-content fade-in">
            <header className="page-header">
                <h2>Profile & Settings</h2>
            </header>

            <div className="profile-header-card card">
                <div
                    className="avatar-box"
                    onClick={() => setIsAvatarModalOpen(true)}
                    style={{ background: 'transparent', cursor: 'pointer', padding: 0, width: 80, height: 80, border: 'none' }}
                >
                    {user?.avatar ? (
                        <AnimatedAvatar avatar={user.avatar} size={80} />
                    ) : (
                        // We use a default animated avatar if none saved, or we could fallback to initials
                        <AnimatedAvatar size={80} />
                    )}
                </div>
                <div className="profile-info">
                    <div className="name-row">
                        <h3>{user?.name || 'Guest User'}</h3>
                        <span className="badge student">{user?.role || 'Student'}</span>
                    </div>
                    <p className="email-text">{user?.email || 'No email'}</p>
                </div>
            </div>

            {sections.map((section, idx) => (
                <div key={idx} className="profile-section">
                    <h4 className="section-title">{section.title}</h4>
                    <div className="card list-card">
                        {section.items.map((item, i) => (
                            <div
                                key={i}
                                className={`list-item ${item.type === 'toggle' || item.type === 'link' ? 'clickable' : ''}`}
                                onClick={() => {
                                    if (item.type === 'toggle') handleToggle(item.id);
                                    if (item.type === 'link' && item.path) navigate(item.path);
                                }}
                            >
                                <item.icon className="item-icon" />
                                <div className="item-content">
                                    <span className="item-label">{item.label}</span>
                                    {item.subLabel && <span className="item-sublabel">{item.subLabel}</span>}
                                    {item.type === 'simple' && <span className="item-value">{item.value}</span>}
                                </div>

                                {item.type === 'value' && (
                                    <div className="item-value-box">
                                        <span className="item-value">{item.value}</span>
                                        <HiOutlineChevronRight className="arrow-icon" />
                                    </div>
                                )}

                                {item.type === 'link' && <HiOutlineChevronRight className="arrow-icon" />}

                                {item.type === 'toggle' && (
                                    <div className={`toggle-switch ${item.id === 'dark-mode' ? (isDark ? 'active' : '') : (toggles[item.id] ? 'active' : '')}`}>
                                        <div className="toggle-thumb" />
                                    </div>
                                )}

                                {!item.type && (
                                    <span className="item-value">{item.value}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}


            <button className="btn-filled logout-btn" onClick={logout} style={{ background: 'var(--error-red)' }}>
                <HiOutlineLogout /> Sign Out
            </button>

            {/* Avatar Customizer Modal */}
            {isAvatarModalOpen && (
                <div className="modal-overlay" onClick={() => setIsAvatarModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
                        <AvatarCustomizer
                            initialAvatar={user?.avatar}
                            onCancel={() => setIsAvatarModalOpen(false)}
                            onAvatarSelected={(newAvatar) => {
                                // Simulate updating the user context
                                if (user) {
                                    updateUser({ ...user, avatar: newAvatar });
                                    // In real app, make API call here to save avatar
                                }
                                setIsAvatarModalOpen(false);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
