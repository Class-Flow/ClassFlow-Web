import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useDragControls } from 'framer-motion';
import {
    HiOutlineCalendar, HiOutlineCollection, HiOutlineChartBar,
    HiOutlineSparkles, HiOutlineMicrophone, HiOutlineDeviceMobile,
    HiOutlineMail
} from 'react-icons/hi';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import logoImg from '../assets/selogo.png';
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
    const { scrollYProgress } = useScroll({ container: containerRef });
    const ropeDragControls = useDragControls();

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            if (latest > 0.05 && !scrolled) {
                setScrolled(true);
            } else if (latest <= 0.05 && scrolled) {
                setScrolled(false);
            }
        });
        return () => unsubscribe();
    }, [scrollYProgress, scrolled]);

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
                            <img src={logoImg} alt="ClassFlow Logo" className="cap-icon-img" />
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
                        animate={{ opacity: scrolled ? 0 : 1 }}
                        transition={{ duration: 0.3 }}
                        style={{ pointerEvents: scrolled ? 'none' : 'auto' }}
                    >
                        <span className="scroll-hint">Scroll to explore</span>
                    </motion.div>
                </section>

                <section className="welcome-about">
                    <motion.div
                        className="about-content"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="section-title">What is ClassFlow?</h2>
                        <p className="section-desc">
                            ClassFlow is an all-in-one unified academic management platform crafted for modern learners and educators.
                            Whether you're an individual student aiming to organize your chaotic syllabus, or an institution looking to empower your entire cohort with a centralized intelligence hub — we provide the definitive tools to eliminate academic friction.
                        </p>
                    </motion.div>
                </section>

                <section className="welcome-features">
                    <motion.div
                        className="features-header"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                    >
                        <h2 className="section-title">Built for Your Productivity</h2>
                        <p className="section-desc">Everything engineered to keep you consistently on top of your game.</p>
                    </motion.div>

                    <div className="features-feed">
                        {features.map((feat, index) => (
                            <motion.div
                                key={feat.id}
                                className="feature-card-web"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.4 }}
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
                        transition={{ delay: 0.1 }}
                        onClick={() => navigate('/ready')}
                    >
                        Begin Your Journey
                    </motion.button>
                </section>

                <section className="welcome-download">
                    <motion.div
                        className="download-content"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-10%" }}
                    >
                        <h2 className="section-title">Take ClassFlow Anywhere</h2>
                        <p className="section-desc">Our dedicated mobile applications are currently being packaged. Downloads will be available shortly after official deployment!</p>

                        <div className="download-buttons">
                            <button className="download-btn disabled" disabled>
                                <HiOutlineDeviceMobile /> App Store <span className="coming-soon">Soon</span>
                            </button>
                            <button className="download-btn disabled" disabled>
                                <HiOutlineDeviceMobile /> Google Play <span className="coming-soon">Soon</span>
                            </button>
                        </div>
                    </motion.div>
                </section>

                <footer className="welcome-footer">
                    <div className="footer-content-web">
                        <div className="connect-section">
                            <h3>Connect With Us</h3>
                            <p>Got questions or feedback? We'd love to hear from you as we continue to build.</p>
                            <div className="social-links-web">
                                <a href="#" aria-label="Twitter"><FaTwitter /></a>
                                <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
                                <a href="#" aria-label="GitHub"><FaGithub /></a>
                                <a href="#" aria-label="Email"><HiOutlineMail /></a>
                            </div>
                            <div className="contact-details">
                                <span>support@classflow.com</span>
                                <span className="divider-dot">•</span>
                                <span>1-800-CLASS-FLOW</span>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom-web">
                        <p>© 2026 ClassFlow. All rights reserved.</p>
                    </div>
                </footer>
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
