import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpaceBackground from '../components/SpaceBackground';
import './WelcomePage.css';

const WelcomePage = () => {
    const navigate = useNavigate();
    const [pullOffset, setPullOffset] = useState(0);

    // Desktop alternative to pull standard rope (we'll implement basic scroll/click for web)

    return (
        <div className="welcome-container">
            <SpaceBackground />

            <div className="welcome-content slide-up">
                <div className="eyebrow-chip">ACADEMIC PLANNER</div>

                <h1 className="brand-title">
                    ClassFlow
                </h1>

                <div className="accent-line" />

                <p className="subtitle typing-effect">
                    Your academic journey,<br />
                    beautifully organized.
                </p>

                <div className="features-list">
                    <div className="feature-item fade-in delay-1">
                        <span className="feature-number">01</span>
                        <div>
                            <h4>Unified Event System</h4>
                            <p>Classes, exams, deadlines and assignments</p>
                        </div>
                    </div>
                    <div className="feature-item fade-in delay-2">
                        <span className="feature-number">02</span>
                        <div>
                            <h4>Smart Organization</h4>
                            <p>Powerful filtering by subject and date</p>
                        </div>
                    </div>
                    <div className="feature-item fade-in delay-3">
                        <span className="feature-number">03</span>
                        <div>
                            <h4>Attendance Tracking</h4>
                            <p>Live monitoring with a 75% predictor</p>
                        </div>
                    </div>
                </div>

                <button className="begin-btn scale-in delay-4" onClick={() => navigate('/onboarding')}>
                    Begin Your Journey
                </button>
            </div>
        </div>
    );
};

export default WelcomePage;
