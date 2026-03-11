import React, { useEffect, useState } from 'react';
import './GamificationPopup.css';

const GamificationPopup = ({ isOpen, onClose, eventTitle, statusType, pointChange, newRank, isPromotion, isDemotion }) => {
    const [animState, setAnimState] = useState('entering');

    useEffect(() => {
        if (isOpen) {
            setAnimState('entering');
            // Play sound logic here if not muted
            const timer1 = setTimeout(() => setAnimState('entered'), 600);
            const timer2 = setTimeout(() => {
                setAnimState('exiting');
                setTimeout(onClose, 400); // Wait for exit animation
            }, 6000); // Auto close after 6 sec

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getConfig = () => {
        if (isPromotion) {
            return { color: 'var(--success-green)', emoji: '🚀', title: 'PROMOTION!', msg: `You reached Rank: ${newRank}! Incredible work! 🌟` };
        }
        if (isDemotion) {
            return { color: 'var(--error-red)', emoji: '📉', title: 'RANK DROP', msg: `You fell to Rank: ${newRank}. You can bounce back! 💪` };
        }

        switch (statusType) {
            case 'present':
                return { color: 'var(--primary-blue)', emoji: '⭐', title: 'PRESENT!', msg: "Marked present! You're on fire! 🔥" };
            case 'absent':
                return { color: 'var(--warning-amber)', emoji: '🥱', title: 'ABSENT', msg: 'Missed! Make sure to catch the next one! ⚠️' };
            case 'cancelled':
                return { color: 'var(--secondary-purple)', emoji: 'ℹ️', title: 'CANCELLED', msg: 'Event cancelled - no penalty applied.' };
            default:
                return { color: 'var(--primary-blue)', emoji: '✓', title: 'MARKED', msg: 'Status recorded!' };
        }
    };

    const config = getConfig();
    const isPositive = pointChange >= 0;

    return (
        <div className="gamification-overlay">
            {/* Floating Particles Mock */}
            <div className="particles-layer">
                {[10, 20, 30].map((val, i) => (
                    <div key={i} className="floating-particle" style={{ animationDelay: `${i * 0.3}s`, backgroundColor: config.color }}>
                        {isPositive ? '+' : ''}{pointChange || 0}
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
                    <div className="gami-stats-row" style={{justifyContent: 'center'}}>
                        <div className={`gami-stat-box ${isPositive ? 'success-box' : 'error-box'}`} style={{width: '100%'}}>
                            <div className="stat-icon-wrapper">
                                <span className="stat-icon">{isPositive ? '↑' : '↓'}</span>
                            </div>
                            <h3>{isPositive ? '+' : ''}{pointChange || 0}</h3>
                            <span>Points</span>
                        </div>
                    </div>
                </div>

                <div className="gami-accent-bar bottom" />
            </div>
        </div>
    );
};

export default GamificationPopup;
