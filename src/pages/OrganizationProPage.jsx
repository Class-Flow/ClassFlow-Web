import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowLeft, HiOutlineBadgeCheck, HiOutlineUserGroup, HiOutlineChartSquareBar } from 'react-icons/hi';
import './ReadyPage.css'; // Reuse some basic styles

const OrganizationProPage = () => {
    const navigate = useNavigate();

    return (
        <div className="ready-page" style={{ justifyContent: 'flex-start', paddingTop: '80px' }}>
            <motion.div
                className="ready-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ maxWidth: '600px', textAlign: 'left', alignItems: 'flex-start' }}
            >
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '32px' }}
                >
                    <HiOutlineArrowLeft /> Back
                </button>

                <div className="eyebrow-chip" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#F59E0B' }}>
                    COMING SOON
                </div>

                <h1 className="ready-title" style={{ fontSize: '36px' }}>
                    ClassFlow <span style={{ color: '#F59E0B' }}>Pro</span>
                </h1>

                <p className="ready-subtitle">
                    The ultimate academic management platform built specifically for schools, universities, and large educational institutions.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', marginBottom: '48px' }}>
                    <div className="org-card" style={{ display: 'flex', gap: '16px', margin: 0 }}>
                        <HiOutlineUserGroup size={32} color="#00E5FF" />
                        <div>
                            <h3 style={{ marginBottom: '4px' }}>Unified Campus Roster</h3>
                            <p style={{ margin: 0 }}>Manage thousands of students and faculty members across multiple departments seamlessly.</p>
                        </div>
                    </div>

                    <div className="org-card" style={{ display: 'flex', gap: '16px', margin: 0 }}>
                        <HiOutlineChartSquareBar size={32} color="#F59E0B" />
                        <div>
                            <h3 style={{ marginBottom: '4px' }}>Deep Analytics & Insights</h3>
                            <p style={{ margin: 0 }}>Track university-wide attendance, detect early burnout risks, and evaluate overall coursework distribution.</p>
                        </div>
                    </div>

                    <div className="org-card" style={{ display: 'flex', gap: '16px', margin: 0 }}>
                        <HiOutlineBadgeCheck size={32} color="#10B981" />
                        <div>
                            <h3 style={{ marginBottom: '4px' }}>Automated Timetables</h3>
                            <p style={{ margin: 0 }}>One-click curriculum and timetable synchronization directly with all students' devices.</p>
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%', textAlign: 'center' }}>
                    <h4 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Interested in beta access?</h4>
                    <button className="btn-create" style={{ width: '100%' }}>
                        Join the Waitlist
                    </button>
                </div>

            </motion.div>
        </div>
    );
};

export default OrganizationProPage;
