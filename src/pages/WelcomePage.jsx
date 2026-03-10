import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useAnimation, useDragControls } from 'framer-motion';
import { HiOutlineCalendar, HiOutlineCollection, HiOutlineChartBar, HiOutlineSparkles, HiOutlineMicrophone } from 'react-icons/hi';
import './WelcomePage.css';

const WelcomePage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ container: containerRef });
    const ropeDragControls = useDragControls();

    // Map scroll progress to the neon line height visually
    const lineHeight = useTransform(scrollYProgress, [0, 1], ['10%', '90%']);

    const handleRopeDragEnd = (event, info) => {
        if (info.offset.y > 100) {
            navigate('/ready');
        }
    };

    const features = [
        {
            id: '01',
            title: 'Unified Event System',
            desc: 'Classes, exams, deadlines and assignments — all managed in one clean, intelligent view.',
            icon: HiOutlineCalendar
        },
        {
            id: '02',
            title: 'Smart Organization',
            desc: 'Powerful filtering by subject, priority, and date. Always know what matters most right now.',
            icon: HiOutlineCollection
        },
        {
            id: '03',
            title: 'Attendance Tracking',
            desc: 'Live attendance monitoring with a smart 75% predictor that alerts you before it is too late.',
            icon: HiOutlineChartBar
        },
        {
            id: '04',
            title: 'Gamification & Streaks',
            desc: 'Earn badges, build daily streaks and unlock rewards for consistently staying on top of it all.',
            icon: HiOutlineSparkles
        },
        {
            id: '05',
            title: 'Voice Notes & Files',
            desc: 'Record voice memos and attach files directly to events — your notes, exactly where you need them.',
            icon: HiOutlineMicrophone
        }
    ];

    return (
        <div className="welcome-wrapper">
            {/* The scrollable container */}
            <div className="welcome-scroll-container" ref={containerRef}>

                {/* Hero / Splash Section */}
                <section className="welcome-hero">
                    <motion.div
                        className="welcome-logo-container"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                    >
                        {/* Custom SVG logo based on image */}
                        <div className="welcome-logo-circle">
                            <div className="welcome-logo-ring"></div>
                            <svg className="cap-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4L2 9L12 14L22 9L12 4Z" fill="var(--primary-blue)" />
                                <path d="M5 10.5V16C5 18 8.13401 20 12 20C15.866 20 19 18 19 16V10.5M12 14V20" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </motion.div>

                    <motion.div
                        className="welcome-hero-text"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <h1 className="brand-h1">ClassFlow</h1>
                        <div className="brand-line" />
                        <p className="brand-subtitle">Academic Planning Made Simple</p>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section className="welcome-features">
                    <div className="intro-text">
                        <div className="eyebrow-chip">ACADEMIC PLANNER</div>
                        <h2 className="title">ClassFlow</h2>
                        <p className="subtitle">Your academic journey,<br />beautifully organized.</p>
                        <span className="scroll-hint">Scroll to explore features</span>
                    </div>

                    <div className="features-chip">FEATURES</div>

                    <div className="features-feed">
                        {features.map((feat, index) => (
                            <motion.div
                                key={feat.id}
                                className="feature-card-web"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="feat-icon-box">
                                    <feat.icon />
                                </div>
                                <div className="feat-text-box">
                                    <h3>{feat.title}</h3>
                                    <p>{feat.desc}</p>
                                </div>
                                <div className="feat-bg-num">{feat.id}</div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.button
                        className="begin-journey-btn"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        onClick={() => navigate('/ready')}
                    >
                        Begin Your Journey
                    </motion.button>

                    {/* Bottom padding so user can scroll down fully */}
                    <div className="bottom-space" />
                </section>
            </div>

            {/* Fixed Right-side Pull Rope */}
            <div className="rope-container">
                <motion.div className="rope-line" style={{ height: lineHeight }} />
                <motion.div
                    className="rope-handle"
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 200 }}
                    dragElastic={0.2}
                    onDragEnd={handleRopeDragEnd}
                    style={{ y: lineHeight }}
                >
                    <div className="rope-dot" />
                    <div className="rope-tooltip">Pull down ↓</div>
                </motion.div>
            </div>

            <button className="mobile-skip-btn" onClick={() => navigate('/ready')}>
                Skip ↓
            </button>
        </div>
    );
};

export default WelcomePage;
