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
    const [isAvatarViewOpen, setIsAvatarViewOpen] = useState(false);

    // Fallback initials
    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
    };

    const sections = [
        {
            title: 'Appearance',
            items: [
                { id: 'dark-mode', label: 'Theme Mode', subLabel: `Current: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`, type: 'toggle', icon: isSpace ? HiOutlineLightningBolt : HiOutlineMoon },
                { id: 'timeline', label: 'My Timeline', type: 'link', icon: HiOutlineClock, path: '/timeline' },
            ]
        },
        {
            title: 'Data & Categories',
            items: [
                { id: 'organization', label: 'Organization', subLabel: 'University details', type: 'link', icon: HiOutlineOfficeBuilding, path: '/organization' },
                { id: 'manage-categories', label: 'Manage Categories', subLabel: 'Organize your events', type: 'link', icon: HiOutlineCollection, path: '/categories' },
            ]
        },
        {
            title: 'About',
            items: [
                { id: 'privacy', label: 'Privacy Policy', type: 'link', icon: HiOutlineShieldCheck, path: '/privacy' },
            ]
        }
    ];

    const [toggles, setToggles] = useState({});

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
                <div className="avatar-hover-container">
                    <div className="avatar-img-wrap">
                        {user?.avatar ? (
                            <AnimatedAvatar avatar={user.avatar} size={80} />
                        ) : (
                            <AnimatedAvatar size={80} />
                        )}
                    </div>
                    <div className="avatar-hover-overlay">
                        <button className="avatar-opt-btn" onClick={() => setIsAvatarViewOpen(true)}>View</button>
                        <button className="avatar-opt-btn" onClick={() => setIsAvatarModalOpen(true)}>Edit</button>
                    </div>
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
                    <div className="modal-content slide-down-content" onClick={e => e.stopPropagation()} style={{ padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
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
            {/* Avatar View Modal */}
            {isAvatarViewOpen && (
                <div className="modal-overlay" onClick={() => setIsAvatarViewOpen(false)}>
                    <div className="modal-content slide-down-content" onClick={e => e.stopPropagation()} style={{ background: 'transparent', border: 'none', boxShadow: 'none', display: 'flex', justifyContent: 'center' }}>
                        <div className="avatar-view-box">
                            <h3 style={{color: 'var(--text-primary)', margin: 0}}>Avatar Preview</h3>
                            {user?.avatar ? <AnimatedAvatar avatar={user.avatar} size={150} /> : <AnimatedAvatar size={150} />}
                            <button className="btn-filled" onClick={() => setIsAvatarViewOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
