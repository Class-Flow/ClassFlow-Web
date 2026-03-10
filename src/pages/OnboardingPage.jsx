import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineFolderOpen, HiOutlineBell, HiOutlineMicrophone } from 'react-icons/hi';
import './OnboardingPage.css';

const OnboardingPage = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);

    const pages = [
        {
            title: 'Unified Event System',
            description: 'Manage classes, exams, assignments, and deadlines all in one place with intelligent classifications.',
            icon: HiOutlineCalendar,
            color: '#3b82f6' // blue
        },
        {
            title: 'Smart Organization',
            description: 'Categorize events by subject, set priorities, and track progress with powerful filtering tools.',
            icon: HiOutlineFolderOpen,
            color: '#14b8a6' // teal
        },
        {
            title: 'Never Miss a Deadline',
            description: 'Set reminders, view timelines, and stay on top of your academic schedule with ease.',
            icon: HiOutlineBell,
            color: '#8b5cf6' // purple
        },
        {
            title: 'Voice Notes & More',
            description: 'Attach voice recordings, files, and notes to any event for comprehensive context.',
            icon: HiOutlineMicrophone,
            color: '#f59e0b' // amber
        }
    ];

    const next = () => {
        if (currentPage < pages.length - 1) {
            setCurrentPage(prev => prev + 1);
        } else {
            navigate('/auth');
        }
    };

    const currentData = pages[currentPage];
    const IconComponent = currentData.icon;

    return (
        <div className="onboarding-container">
            <div className="onboarding-content">
                <div className="icon-container scale-in" style={{ backgroundColor: `${currentData.color}22` }} key={`icon-${currentPage}`}>
                    <IconComponent size={50} color={currentData.color} />
                </div>

                <h1 className="slide-up" key={`title-${currentPage}`}>{currentData.title}</h1>
                <p className="slide-up delay-1" key={`desc-${currentPage}`}>{currentData.description}</p>
            </div>

            <div className="onboarding-footer">
                <div className="dots-container">
                    {pages.map((_, idx) => (
                        <div
                            key={idx}
                            className={`dot ${idx === currentPage ? 'active' : ''}`}
                        />
                    ))}
                </div>

                <div className="action-buttons">
                    <button className="btn-filled w-full mb-3" onClick={next}>
                        {currentPage === pages.length - 1 ? 'Get Started' : 'Continue'}
                    </button>
                    {currentPage < pages.length - 1 && (
                        <button className="btn-text w-full" onClick={() => navigate('/auth')}>
                            Skip
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;
