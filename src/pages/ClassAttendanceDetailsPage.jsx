import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlineTrash, HiChartPie, HiPlus, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClock, HiOutlineBan } from 'react-icons/hi';
import { attendanceService } from '../services/attendanceService';
import MarkAttendanceModal from '../components/MarkAttendanceModal';

const ClassAttendanceDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { subject } = location.state || {};

    const [records, setRecords] = useState([]);
    const [stats, setStats] = useState({ present: 0, total: 0, percentage: 0 });
    const [loading, setLoading] = useState(false);
    const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('marked'); // 'marked' or 'unmarked'

    // As Web backend does not return full event schedule easily yet, 
    // we'll primarily support viewing & editing marked attendance, 
    // and using the "Add" button to mark a new date.

    useEffect(() => {
        if (!subject) {
            navigate('/attendance');
            return;
        }
        fetchData();
    }, [subject]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch stats for header
            const statsRes = await attendanceService.getStats();
            if (statsRes.success && statsRes.data[subject.subject]) {
                const s = statsRes.data[subject.subject];
                const attended = s.present + (s.late || 0);
                setStats({
                    present: attended,
                    total: s.total,
                    absent: s.absent,
                    percentage: s.total > 0 ? Math.round((attended / s.total) * 100) : 0
                });
            }

            // Fetch records for this subject
            const allRecordsRes = await attendanceService.getAttendance();
            if (allRecordsRes.success) {
                const filtered = allRecordsRes.data.filter(r => r.courseName === subject.subject);
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                setRecords(filtered);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to unmark this attendance record?")) {
            try {
                const res = await attendanceService.deleteRecord(id);
                if (res.success) fetchData();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'present': return <HiOutlineCheckCircle className="status-icon success" />;
            case 'absent': return <HiOutlineXCircle className="status-icon error" />;
            case 'late': return <HiOutlineClock className="status-icon warning" />;
            default: return <HiOutlineBan className="status-icon other" />;
        }
    };

    if (!subject) return null;

    return (
        <div className="attendance-details-content fade-in">
            <header className="page-header-alt">
                <button className="back-btn-ghost" onClick={() => navigate(-1)}>
                    <HiOutlineChevronLeft />
                </button>
                <h2>{subject.subject}</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        className="icon-btn"
                        onClick={() => navigate('/attendance/predictor', { state: { subject: subject.subject } })}
                        title="Predictor"
                    >
                        <HiChartPie />
                    </button>
                    <button className="icon-btn" onClick={() => setIsMarkModalOpen(true)}>
                        <HiPlus />
                    </button>
                </div>
            </header>

            <div className="stats-header-card card" style={{
                background: stats.percentage >= 75 ? 'linear-gradient(135deg, rgba(16,185,129,0.8), rgba(16,185,129,0.6))' : 'linear-gradient(135deg, rgba(239,68,68,0.8), rgba(239,68,68,0.6))',
                color: 'white',
                marginTop: '16px'
            }}>
                <div className="stats-header-top">
                    <span style={{ fontSize: '16px', fontWeight: '600' }}>Attendance Rate</span>
                    <span style={{ fontSize: '32px', fontWeight: '700' }}>{stats.percentage}%</span>
                </div>
                <div className="progress-bar-container" style={{ background: 'rgba(255,255,255,0.3)', marginTop: '12px' }}>
                    <div className="progress-bar-fill" style={{ width: `${stats.percentage}%`, background: 'white' }} />
                </div>
                <div className="stats-header-bottom" style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
                    <div className="stat-col">
                        <span className="stat-val">{stats.present}</span>
                        <span className="stat-lbl">Present</span>
                    </div>
                    <div className="stat-col">
                        <span className="stat-val">{stats.absent || 0}</span>
                        <span className="stat-lbl">Absent</span>
                    </div>
                </div>
            </div>

            <div className="custom-tabs" style={{ marginTop: '24px', display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <button
                    className={`tab-btn ${activeTab === 'marked' ? 'active' : ''}`}
                    onClick={() => setActiveTab('marked')}
                    style={{ background: 'transparent', border: 'none', fontSize: '15px', fontWeight: '600', color: activeTab === 'marked' ? 'var(--primary-blue)' : 'var(--text-secondary)', cursor: 'pointer', paddingBottom: '4px', borderBottom: activeTab === 'marked' ? '2px solid var(--primary-blue)' : '2px solid transparent' }}
                >
                    Marked ({records.length})
                </button>
            </div>

            <div className="records-list" style={{ marginTop: '16px', flex: 1, overflowY: 'auto' }}>
                {loading ? (
                    <div className="loading-state">Loading records...</div>
                ) : records.length === 0 ? (
                    <div className="empty-state" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                        <HiChartPie size={48} style={{ opacity: 0.3 }} />
                        <p style={{ marginTop: '12px' }}>No attendance marked yet.</p>
                    </div>
                ) : (
                    records.map(r => (
                        <div key={r.id} className="record-card card" style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', padding: '16px' }}>
                            <div className="record-icon" style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-secondary)', marginRight: '16px' }}>
                                {getStatusIcon(r.status)}
                            </div>
                            <div className="record-info" style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', fontSize: '15px' }}>{new Date(r.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                <div style={{ fontSize: '12px', marginTop: '4px', textTransform: 'uppercase', fontWeight: '700', color: r.status === 'present' ? 'var(--success-green)' : r.status === 'absent' ? 'var(--error-red)' : 'var(--warning-amber)' }}>
                                    {r.status}
                                </div>
                            </div>
                            <button
                                className="icon-btn-danger"
                                onClick={() => handleDelete(r.id)}
                                style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error-red)', padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                <HiOutlineTrash size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <MarkAttendanceModal
                isOpen={isMarkModalOpen}
                initialCourse={subject.subject}
                onClose={() => setIsMarkModalOpen(false)}
                onAttendanceMarked={fetchData}
            />
        </div>
    );
};

export default ClassAttendanceDetailsPage;
