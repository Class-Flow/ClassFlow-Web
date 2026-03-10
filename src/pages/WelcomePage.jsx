import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useDragControls } from 'framer-motion';
import { HiOutlineCalendar, HiOutlineCollection, HiOutlineChartBar, HiOutlineSparkles, HiOutlineMicrophone } from 'react-icons/hi';
import './WelcomePage.css';

const TypewriterText = () => {
    const phrases = [
        "Your academic journey, beautifully organized.",
        "Focus on what matters most, effortlessly.",
        "Track attendance and manage tasks with AI."
    ];
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);
    const [blink, setBlink] = useState(true);

    useEffect(() => {
        if (subIndex === phrases[index].length + 1 && !reverse) {
            const timeout = setTimeout(() => setReverse(true), 2500);
            return () => clearTimeout(timeout);
        }

        if (subIndex === 0 && reverse) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setReverse(false);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIndex((prev) => (prev + 1) % phrases.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, Math.max(reverse ? 25 : 50, parseInt(Math.random() * 40)));

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, phrases]);

    useEffect(() => {
        const timeout2 = setInterval(() => {
            setBlink((prev) => !prev);
        }, 500);
        return () => clearInterval(timeout2);
    }, []);

    return (
        <div className="typing-container">
            <span>{phrases[index].substring(0, subIndex)}</span>
            <span style={{ opacity: blink ? 1 : 0, fontWeight: 300, marginLeft: '4px', color: '#00E5FF' }}>|</span>
        </div>
    );
};

const WelcomePage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // Tracks the scroll of the scroll-container explicitly to make the neon rope shrink
    const { scrollYProgress } = useScroll({ container: containerRef });
    const ropeDragControls = useDragControls();

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
            <motion.div
                className="top-left-chip"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
            >
                ACADEMIC PLANNER
            </motion.div>

            <div className="welcome-scroll-container" ref={containerRef}>
                <section className="welcome-hero">
                    <motion.div
                        className="welcome-logo-container"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                    >
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
                        <TypewriterText />
                    </motion.div>

                    <motion.div
                        className="scroll-down-mouse"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                    >
                        <span className="scroll-hint">Scroll to explore</span>
                    </motion.div>
                </section>

                <section className="welcome-features">
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

                    <div className="bottom-space" />
                </section>
            </div>

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
