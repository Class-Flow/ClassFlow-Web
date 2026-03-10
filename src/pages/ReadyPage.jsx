import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight } from 'react-icons/hi';
import './ReadyPage.css';

const ReadyPage = () => {
    const navigate = useNavigate();

    return (
        <div className="ready-page">
            <motion.div
                className="ready-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="eyebrow-chip">GET STARTED</div>

                <h1 className="ready-title">
                    Ready to<br />Organize?
                </h1>

                <p className="ready-subtitle">
                    Choose how you want to get started.<br />
                    Your academic command center awaits.
                </p>

                <div className="ready-actions">
                    <button
                        className="btn-create"
                        onClick={() => navigate('/auth', { state: { isLogin: false } })}
                    >
                        <span className="btn-icon">🚀</span> Create Account
                    </button>

                    <button
                        className="btn-signin"
                        onClick={() => navigate('/auth', { state: { isLogin: true } })}
                    >
                        <span className="btn-icon">→</span> Sign In
                    </button>
                </div>

                <motion.div
                    className="org-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <h3>Are you an organisation?</h3>
                    <p>
                        Explore ClassFlow Pro for managing entire institutions with advanced features and dedicated support.
                    </p>
                    <button className="org-link" onClick={() => navigate('/org-pro')}>
                        Learn More <HiOutlineArrowRight />
                    </button>
                </motion.div>

                <p className="privacy-link" onClick={() => navigate('/privacy')}>
                    Privacy Policy
                </p>
            </motion.div>
        </div>
    );
};

export default ReadyPage;
