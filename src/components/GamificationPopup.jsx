import React, { useEffect, useState } from 'react';
import './GamificationPopup.css';

const GamificationPopup = ({ isOpen, onClose, eventTitle, statusType }) => {
    const [stats, setStats] = useState({ successful: 12, unsuccessful: 2 }); // Mock stats
    const [animState, setAnimState] = useState('entering');

    useEffect(() => {
        if (isOpen) {
            setAnimState('entering');
            // Play sound logic here if not muted
            const timer1 = setTimeout(() => setAnimState('entered'), 600);
            const timer2 = setTimeout(() => {
                setAnimState('exiting');
                setTimeout(onClose, 400); // Wait for exit animation
            }, 4000); // Auto close after 4 sec

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getConfig = () => {
        switch (statusType) {
            case 'completed':
                return { color: 'var(--success-green)', emoji: '🎉', title: 'LOCKED IN!', msg: 'You absolutely crushed it! Keep that momentum going! 🔥' };
            case 'present':
                return { color: 'var(--primary-blue)', emoji: '⭐', title: 'PERFECT!', msg: "Perfect attendance! You're on fire! Let's keep it up!" };
            case 'missed':
                return { color: 'var(--error-red)', emoji: '😞', title: 'MISSED', msg: "Next time you got this! Don't give up! 💪" };
            case 'absent':
                return { color: 'var(--warning-amber)', emoji: '😴', title: 'ABSENT', msg: 'Make sure to catch the next one! You can do it!' };
            case 'cancelled':
                return { color: 'var(--secondary-purple)', emoji: 'ℹ️', title: 'CANCELLED', msg: 'Event was cancelled - no worries at all!' };
            default:
                return { color: 'var(--primary-blue)', emoji: '✓', title: 'MARKED', msg: 'Event status recorded!' };
        }
    };

    const config = getConfig();

    return (
        <div className="gamification-overlay">
            {/* Floating Particles Mock */}
            <div className="particles-layer">
                {[10, 20, 30].map((val, i) => (
                    <div key={i} className="floating-particle" style={{ animationDelay: `${i * 0.3}s`, backgroundColor: config.color }}>
                        +{val}
                    </div>
                ))}
            </div>

            <div className={`gamification-modal ${animState}`} style={{ '--accent': config.color }}>
                <div className="gami-accent-bar top" />

                <div className="gami-emoji-circle">
                    <div className="gami-rotating-ring" />
                    <span className="gami-emoji">{config.emoji}</span>
                </div>

                <h2 className="gami-title" style={{ backgroundImage: `linear-gradient(to right, ${config.color}, white)` }}>
                    {config.title}
                </h2>

                <div className="gami-event-badge">
                    {eventTitle}
                </div>

                <p className="gami-msg">{config.msg}</p>

                <div className="gami-stats">
                    <p className="gami-stats-title">TODAY'S PROGRESS</p>
                    <div className="gami-stats-row">
                        <div className="gami-stat-box success-box">
                            <div className="stat-icon-wrapper">
                                <span className="stat-icon">✓</span>
                            </div>
                            <h3>{stats.successful}</h3>
                            <span>Completed</span>
                        </div>
                        <div className="gami-stat-box error-box">
                            <div className="stat-icon-wrapper">
                                <span className="stat-icon">✕</span>
                            </div>
                            <h3>{stats.unsuccessful}</h3>
                            <span>Missed</span>
                        </div>
                    </div>
                </div>

                <div className="gami-accent-bar bottom" />
            </div>
        </div>
    );
};

export default GamificationPopup;
