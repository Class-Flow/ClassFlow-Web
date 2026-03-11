import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
    HiOutlineBell,
    HiOutlineAcademicCap,
    HiOutlineClipboardList,
    HiOutlineInformationCircle,
    HiOutlineUsers,
    HiOutlineCalendar,
    HiOutlineChartBar,
    HiPlus,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineBookOpen,
    HiOutlineEmojiHappy,
    HiOutlineQuestionMarkCircle,
    HiOutlineExclamation,
    HiOutlineFire,
    HiX
} from 'react-icons/hi';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import AddEventModal from '../components/AddEventModal';
import AnimatedAvatar from '../components/AnimatedAvatar';
import GamificationPopup from '../components/GamificationPopup';
import { eventService } from '../services/eventService';
import { aiService } from '../services/aiService';

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('class');
    const [dayStats, setDayStats] = useState({});

    // Details Modal
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Wellness alerts state
    const [procrastinationAlert, setProcrastinationAlert] = useState(null);
    const [burnoutAlert, setBurnoutAlert] = useState(null);
    const [dismissedAlerts, setDismissedAlerts] = useState({});
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Gamification state
    const [gamiState, setGamiState] = useState({ isOpen: false });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Fetch wellness data on mount
    useEffect(() => {
        const fetchWellness = async () => {
            try {
                const [procData, burnData] = await Promise.all([
                    aiService.getProcrastinationAnalysis().catch(() => null),
                    aiService.getBurnoutAnalysis().catch(() => null)
                ]);
                if (procData && procData.warning && procData.warning !== 'OK') {
                    setProcrastinationAlert(procData);
                    toast.warning("AI Detected: Procrastination Risk!", { icon: "⚠️" });
                }
                if (burnData && burnData.burnoutRisk) {
                    setBurnoutAlert(burnData);
                    toast.error("AI Detected: High Burnout Risk!", { icon: "🔥" });
                }
            } catch (err) {
                console.error('Wellness fetch failed:', err);
            }
        };
        fetchWellness();
    }, []);

    const hasActiveNotifications = (procrastinationAlert && !dismissedAlerts.procrastination) || (burnoutAlert && !dismissedAlerts.burnout);



    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const [stats, setStats] = useState({
        classes: 0,
        tasks: 0,
        exams: 0,
        meetings: 0
    });
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    const fetchStats = useCallback(async () => {
        try {
            // Fetch Today's Stats
            const today = new Date();
            const eventsRes = await eventService.getEventsByDay(today);
            if (eventsRes.success) {
                const events = eventsRes.data;
                setStats({
                    classes: events.filter(e => e.type === 'class').length,
                    tasks: events.filter(e => e.type === 'assignment' || e.type === 'deadline').length,
                    exams: events.filter(e => e.type === 'exam').length,
                    meetings: events.filter(e => e.type === 'meeting').length
                });

                // Top 3 upcoming events for today
                const upcoming = events
                    .filter(e => new Date(e.startTime) > new Date())
                    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                    .slice(0, 3);
                setUpcomingEvents(upcoming);
            }

            // Fetch Day Stats (Next 3 Days)
            const dayStatsObj = {};
            for (let i = 0; i < 3; i++) {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const dateString = date.toISOString().split('T')[0];
                const response = await eventService.getCountsForDay(date);
                dayStatsObj[dateString] = response.data.count;
            }
            setDayStats(dayStatsObj);

        } catch (error) {
            console.error("Failed to fetch home stats", error);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStats();
    }, [fetchStats, currentTime]);

    const overviewStats = [
        { label: 'Classes', count: stats.classes, icon: HiOutlineAcademicCap, color: 'var(--class-blue)', bg: 'rgba(59, 130, 246, 0.05)' },
        { label: 'Tasks', count: stats.tasks, icon: HiOutlineClipboardList, color: 'var(--assignment-purple)', bg: 'rgba(139, 92, 246, 0.05)' },
        { label: 'Exams', count: stats.exams, icon: HiOutlineInformationCircle, color: 'var(--exam-orange)', bg: 'rgba(245, 158, 11, 0.05)' },
        { label: 'Meetings', count: stats.meetings, icon: HiOutlineUsers, color: 'var(--meeting-teal)', bg: 'rgba(20, 184, 166, 0.05)' },
    ];

    const quickActions = [
        { id: 'class', label: 'Class', icon: HiOutlineAcademicCap, color: 'var(--class-blue)', bg: 'rgba(59, 130, 246, 0.05)' },
        { id: 'assignment', label: 'Assignment', icon: HiOutlineClipboardList, color: 'var(--assignment-purple)', bg: 'rgba(139, 92, 246, 0.05)' },
        { id: 'exam', label: 'Exam', icon: HiOutlineInformationCircle, color: 'var(--exam-orange)', bg: 'rgba(245, 158, 11, 0.05)' },
        { id: 'timetable', label: 'Timetable', icon: HiOutlineCalendar, color: 'var(--meeting-teal)', bg: 'rgba(20, 184, 166, 0.05)' },
        { id: 'attendance', label: 'Attendance', icon: HiOutlineChartBar, color: 'var(--personal-green)', bg: 'rgba(16, 185, 129, 0.05)' },
        { id: 'meeting', label: 'Meeting', icon: HiOutlineUsers, color: 'var(--secondary-teal)', bg: 'rgba(20, 184, 166, 0.05)' },
    ];

    const handleActionClick = (action) => {
        if (action.id === 'timetable' || action.id === 'attendance') {
            navigate(`/${action.id}`);
        } else {
            openCreateModal(action.id);
        }
    };

    const openCreateModal = (type = 'class') => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const handleMarkStatus = async (event, status) => {
        try {
            const response = await eventService.markStatus(event._id, status);
            if (response.success && response.data) {
                fetchStats();
                const { pointChange, newRank, isPromotion } = response.data.gamification || {};
                setGamiState({
                    isOpen: true,
                    eventTitle: event.title,
                    statusType: status,
                    pointChange: pointChange || 0,
                    newRank: newRank || 'Neptune',
                    isPromotion: !!isPromotion,
                    isDemotion: (pointChange < 0 && newRank !== user?.gamification?.rank) // rough heuristic
                });
                setIsDetailsOpen(false);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to mark status');
        }
    };

    return (
        <div className="home-content fade-in">
            {/* Wellness Alerts moved to notifications menu */}

            {/* Header */}
            <header className="home-header">
                <div className="header-text">
                    <h1>Welcome Champ {user?.firstName || user?.name || 'User'}!</h1>
                    <p>{formatDate(currentTime)}</p>
                </div>
                <div className="header-actions">
                    <div className="notification-wrapper" style={{ position: 'relative' }}>
                        <button className="icon-btn" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
                            <HiOutlineBell />
                            {hasActiveNotifications && <span className="notification-dot" style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, background: 'var(--error-red)', borderRadius: '50%' }}></span>}
                        </button>
                        
                        {isNotificationsOpen && (
                            <div className="notifications-dropdown card" style={{ position: 'absolute', top: '100%', right: 0, width: 340, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '80vh', overflowY: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0 }}>Notifications</h4>
                                    <button onClick={() => setIsNotificationsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><HiX /></button>
                                </div>
                                {!hasActiveNotifications ? (
                                    <p style={{ color: 'var(--text-tertiary)', fontSize: 13, textAlign: 'center', margin: '20px 0' }}>No new notifications</p>
                                ) : (
                                    <>
                                        {procrastinationAlert && !dismissedAlerts.procrastination && (
                                            <div className="wellness-alert wellness-alert-warning" style={{ margin: 0, padding: 12 }}>
                                                <div className="alert-icon-wrap" style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, color: 'var(--warning-amber)' }}>
                                                    <HiOutlineExclamation size={24} />
                                                </div>
                                                <div className="alert-body" style={{ fontSize: 13 }}>
                                                    <strong style={{ display: 'block', marginBottom: 4 }}>Procrastination Risk</strong>
                                                    <p className="alert-reason" style={{ margin: 0 }}>{procrastinationAlert.warning}</p>
                                                    <button className="alert-dismiss" style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setDismissedAlerts(prev => ({ ...prev, procrastination: true }))}>
                                                        <HiX />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {burnoutAlert && !dismissedAlerts.burnout && (
                                            <div className="wellness-alert wellness-alert-danger" style={{ margin: 0, padding: 12 }}>
                                                <div className="alert-icon-wrap" style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, color: 'var(--error-red)' }}>
                                                    <HiOutlineFire size={24} />
                                                </div>
                                                <div className="alert-body" style={{ fontSize: 13 }}>
                                                    <strong style={{ display: 'block', marginBottom: 4 }}>Burnout Risk</strong>
                                                    <p className="alert-reason" style={{ margin: 0 }}>You've been consistently overloaded. Rest soon!</p>
                                                    <button className="alert-dismiss" style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setDismissedAlerts(prev => ({ ...prev, burnout: true }))}>
                                                        <HiX />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    {user && (
                        <div className="header-user-profile" onClick={() => navigate('/profile')} style={{cursor: 'pointer'}}>
                            <span className="user-name">{user.firstName || user.name}</span>
                            <div className="user-avatar-circle" style={{background: 'transparent', border: 'none'}}>
                                {user.avatar ? <AnimatedAvatar avatar={user.avatar} size={32} /> : <AnimatedAvatar size={32} />}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div className="dashboard-main-box card">

            {/* Today's Overview */}
            <section className="section">
                <h3 className="section-title">Today's Overview</h3>
                <div className="overview-grid">
                    {overviewStats.map((stat, index) => (
                        <div key={index} className="overview-card card" style={{ background: stat.bg }}>
                            <stat.icon className="stat-icon" style={{ color: stat.color }} />
                            <div className="stat-info">
                                <span className="stat-count" style={{ color: stat.count }}>{stat.count}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Actions */}
            <section className="section">
                <h3 className="section-title">Quick Actions</h3>
                <div className="quick-actions-grid">
                    {quickActions.map((action, index) => (
                        <div key={index} className="action-card card" style={{ background: action.bg }} onClick={() => handleActionClick(action)}>
                            <action.icon className="action-icon" style={{ color: action.color }} />
                            <span className="action-label" style={{ color: action.color }}>{action.label}</span>
                        </div>
                    ))}
                </div>
            </section>


            {/* Upcoming Events */}
            <section className="section">
                <h3 className="section-title">Upcoming Events Today</h3>
                {upcomingEvents.length > 0 ? (
                    <div className="upcoming-events-list">
                        {upcomingEvents.map(event => (
                            <div key={event._id} className="event-card-home card" onClick={() => {
                                setSelectedEvent(event);
                                setIsDetailsOpen(true);
                            }} style={{ cursor: 'pointer' }}>
                                <div className={`event-type-indicator ${event.type}`} />
                                <div className="event-info-home">
                                    <h4>{event.title}</h4>
                                    <div className="event-meta-home">
                                        <HiOutlineClock />
                                        <span>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state-card card">
                        <HiOutlineCheckCircle className="check-icon" />
                        <h4>All Caught Up!</h4>
                        <p>No more events today</p>
                    </div>
                )}
            </section>

            {/* Next 3 Days */}
            <section className="section">
                <h3 className="section-title">Next 3 Days</h3>
                <div className="next-days-row">
                    {[0, 1, 2].map((offset) => {
                        const date = new Date(currentTime);
                        date.setDate(date.getDate() + offset);
                        const isToday = offset === 0;
                        const dateString = date.toISOString().split('T')[0];
                        const count = dayStats[dateString] || 0;

                        return (
                            <div key={offset} className={`day-card card ${isToday ? 'active' : ''}`}>
                                <span className="day-name">
                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                                <div className={`day-number-circle ${isToday ? 'today' : ''}`}>
                                    {date.getDate()}
                                </div>
                                <div className={`event-chip ${count > 0 ? 'has-events' : 'no-events'}`}>
                                    {count} {count === 1 ? 'event' : 'events'}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
            
            <button className="new-event-btn-dash" onClick={() => openCreateModal('class')}>
                <HiPlus /> New Event
            </button>
            </div>

            {/* Modal */}
            {/* Modal */}
            <AddEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialType={modalType}
                onEventAdded={() => {
                    // Re-fetch stats and events
                    const fetchStats = async () => {
                        try {
                            const today = new Date();
                            const eventsRes = await eventService.getEventsByDay(today);
                            if (eventsRes.success) {
                                const events = eventsRes.data;
                                setStats({
                                    classes: events.filter(e => e.type === 'class').length,
                                    tasks: events.filter(e => e.type === 'assignment' || e.type === 'deadline').length,
                                    exams: events.filter(e => e.type === 'exam').length,
                                    meetings: events.filter(e => e.type === 'meeting').length
                                });

                                const upcoming = events
                                    .filter(e => new Date(e.startTime) > new Date())
                                    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                                    .slice(0, 3);
                                setUpcomingEvents(upcoming);
                            }

                            // Also refresh day stats chart if needed
                            const stats = {};
                            for (let i = 0; i < 3; i++) {
                                const date = new Date();
                                date.setDate(date.getDate() + i);
                                const dateString = date.toISOString().split('T')[0];
                                const response = await eventService.getCountsForDay(date);
                                stats[dateString] = response.data.count;
                            }
                            setDayStats(stats);
                        } catch (error) {
                            console.error("Failed to refresh home stats", error);
                        }
                    };
                    fetchStats();
                }}
            />

            <EventDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                event={selectedEvent}
                onMarkStatus={handleMarkStatus}
            />

            <GamificationPopup
                {...gamiState}
                onClose={() => setGamiState({ isOpen: false })}
            />
        </div>
    );
};

export default HomePage;
