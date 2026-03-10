import { useEffect, useState } from 'react';
import './StreakTierPopup.css';

const StreakService = {
    tiers: [
        { tier: 0, name: 'Neptune', emoji: '🌑', color: '#3F51B5', minStreak: 0, description: 'A frozen giant. Complete tasks to travel inward!' },
        { tier: 1, name: 'Uranus', emoji: '🥶', color: '#4DD0E1', minStreak: 10, description: "You're tilting the odds in your favour!" },
        { tier: 2, name: 'Saturn', emoji: '🪐', color: '#D4AC6E', minStreak: 25, description: 'Ringed and radiant! Consistency is your superpower!' },
        { tier: 3, name: 'Jupiter', emoji: '🌩️', color: '#D4825A', minStreak: 45, description: 'The giant awakens! Work ethic is enormous!' },
        { tier: 4, name: 'Mars', emoji: '🔴', color: '#E53935', minStreak: 70, description: 'Red-hot focus! A warrior of deadlines!' },
        { tier: 5, name: 'Earth', emoji: '🌍', color: '#43A047', minStreak: 100, description: 'Home turf — thriving in your natural habitat!' },
        { tier: 6, name: 'Venus', emoji: '✨', color: '#F9A825', minStreak: 135, description: 'Blazing bright! Hot as the Sun itself!' },
        { tier: 7, name: 'Mercury', emoji: '☄️', color: '#78909C', minStreak: 175, description: 'So close you can feel the heat. Elite dedication!' },
        { tier: 8, name: 'Sun', emoji: '☀️', color: '#FDD835', minStreak: 220, description: 'You ARE the Sun — the centre of everything. Legendary!' },
    ],
    getTierInfo: (tierIndex) => {
        return StreakService.tiers[Math.min(Math.max(tierIndex, 0), 8)];
    }
};

const PlanetCircle = ({ tierIndex, size = 88, animate = true }) => {
    const info = StreakService.getTierInfo(tierIndex);

    return (
        <div
            className={`planet-circle ${animate ? 'animated' : ''}`}
            style={{
                width: size, height: size,
                background: `radial-gradient(circle at 30% 30%, ${info.color}, rgba(0,0,0,0.8))`,
                boxShadow: `0 0 ${size / 4}px ${info.color}`,
                border: `2px solid ${info.color}80`
            }}
        />
    );
};

const StreakTierPopup = ({ isOpen, onClose, oldTier = 0, newTier = 1, streakCount = 10 }) => {
    const [animState, setAnimState] = useState('entering');

    useEffect(() => {
        if (isOpen) {
            setAnimState('entering');
            const timer1 = setTimeout(() => setAnimState('entered'), 600);
            const timer2 = setTimeout(() => {
                setAnimState('exiting');
                setTimeout(onClose, 400);
            }, 6000);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const rankUp = newTier >= oldTier;
    const tierInfo = StreakService.getTierInfo(newTier);
    const accentColor = rankUp ? tierInfo.color : 'var(--error-red)';

    return (
        <div className="streak-overlay">
            <div className={`streak-modal ${animState}`} style={{ '--accent': accentColor, borderColor: accentColor }}>
                <div className="gami-accent-bar top" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />

                <div className="planet-container">
                    <PlanetCircle tierIndex={newTier} size={110} animate={true} />
                </div>

                <h2 className="streak-title" style={{ backgroundImage: `linear-gradient(to right, ${accentColor}, white)` }}>
                    {rankUp ? 'RANK UP!' : 'RANK DROPPED'}
                </h2>

                <div className="tier-info-card" style={{ background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)` }}>
                    <div className="tier-emoji">{tierInfo.emoji || '🚀'}</div>
                    <div className="tier-text">
                        <h4 style={{ color: accentColor }}>{tierInfo.name}</h4>
                        <p>{tierInfo.description}</p>
                    </div>
                </div>

                <p className="streak-count">{streakCount} streak points</p>
                <p className="streak-msg">
                    {rankUp
                        ? `Great work! You've reached ${tierInfo.name}. Keep the momentum going!`
                        : `Don't give up! Bounce back stronger to reclaim your rank!`
                    }
                </p>

                <div className="planet-row">
                    {StreakService.tiers.map((t, i) => (
                        <div key={i} className="planet-row-item">
                            <PlanetCircle tierIndex={i} size={newTier === i ? 28 : 18} animate={newTier === i} />
                        </div>
                    ))}
                </div>

                <button
                    className="streak-btn"
                    onClick={() => { setAnimState('exiting'); setTimeout(onClose, 400); }}
                    style={{ backgroundColor: accentColor }}
                >
                    {rankUp ? 'Keep it up! 🚀' : 'Bounce back! 💪'}
                </button>

                <div className="gami-accent-bar bottom" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
            </div>
        </div>
    );
};

export default StreakTierPopup;
