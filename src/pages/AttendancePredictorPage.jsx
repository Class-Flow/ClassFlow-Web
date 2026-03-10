import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft, HiPlus, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { attendanceService } from '../services/attendanceService';

const AttendancePredictorPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialCourse = location.state?.subject;

    // To simulate predictor, we will maintain an array of leave dates.
    // In actual app, these combine with timetable. Here we'll do a basic simulation.
    const [currentDate, setCurrentDate] = useState(new Date());
    const [displayMonth, setDisplayMonth] = useState(new Date());
    const [leaveDates, setLeaveDates] = useState(new Set());
    const [considerUnmarkedAsPresent, setConsiderUnmarkedAsPresent] = useState(true);

    const [stats, setStats] = useState({ present: 0, total: 0, percentage: 0 });
    const [courseMap, setCourseMap] = useState(new Map());
    const [selectedCourse, setSelectedCourse] = useState(null);

    const fetchStats = async () => {
        try {
            const res = await attendanceService.getStats();
            if (res.success && initialCourse) {
                const cMap = new Map();
                res.data.courses.forEach(c => {
                    cMap.set(c.courseCode, {
                        ...c,
                        present: c.attendedClasses,
                        total: c.totalClasses
                    });
                });
                setCourseMap(cMap);

                if (cMap.has(initialCourse)) {
                    setSelectedCourse(cMap.get(initialCourse));
                    const s = cMap.get(initialCourse);
                    setStats({
                        present: s.present,
                        absent: s.total - s.present,
                        total: s.total
                    });
                }
            }
        } catch (error) {
            console.error("Failed to fetch predictor stats", error);
        }
    };

    useEffect(() => {
        if (initialCourse) {
            fetchStats();
        }
    }, [initialCourse]);

    const toggleLeaveDate = (dateStamp) => {
        const newLeaves = new Set(leaveDates);
        if (newLeaves.has(dateStamp)) {
            newLeaves.delete(dateStamp);
        } else {
            newLeaves.add(dateStamp);
        }
        setLeaveDates(newLeaves);
    };

    const nextMonth = () => {
        setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1));
    };

    // Calculate prediction based on leaves.
    // Assuming 2 classes per week for the course over the next 4 weeks. (Simple Mock)
    const renderPredictions = () => {
        // Mocking future classes based on current date
        if (!initialCourse) return null;

        // Start with current stats
        let predictedTotal = stats.total;
        let predictedPresent = stats.present;

        // In a real scenario, we'd check against timetable.
        // For predictor simulation: Each leave date selected counts as 1 missed class
        // and 1 total class. We don't know the exact timetable without events API,
        // so we'll just subtract from potential present if it's considered.

        // Simplify simulation: 
        // We'll add N future classes. N = 10.
        const futureClassesCount = 10;
        predictedTotal += futureClassesCount;

        // If considerUnmarkedAsPresent is true, all future classes are attended EXCEPT leave dates
        // Let's say all selected leave dates fall on future class days.
        const leavesTaken = leaveDates.size;

        if (considerUnmarkedAsPresent) {
            predictedPresent += (futureClassesCount - leavesTaken); // attends the ones not on leave
        } else {
            // Unmarked not present, meaning they only attend what's already marked.
            // Leaves are still absences.
        }

        const predictedPercentage = predictedTotal > 0 ? ((predictedPresent / predictedTotal) * 100).toFixed(1) : 0;

        return (
            <div className="prediction-card card" style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-surface)' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>{initialCourse} Prediction</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Current</span>
                    <span style={{ fontWeight: '600' }}>{((stats.total > 0 ? stats.present / stats.total : 0) * 100).toFixed(1)}%</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px outset var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Predicted</span>
                    <span style={{ fontWeight: '700', color: predictedPercentage >= 75 ? 'var(--success-green)' : 'var(--error-red)' }}>{predictedPercentage}%</span>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    *Simulation based on {futureClassesCount} future classes. You marked {leavesTaken} leave(s).
                </div>
            </div>
        );
    };

    const renderCalendar = () => {
        const year = displayMonth.getFullYear();
        const month = displayMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const grid = [];
        // empty slots
        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            grid.push(<div key={`empty-${i}`} className="cal-cell empty"></div>);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(year, month, d);
            const dateStamp = dateObj.toISOString().split('T')[0];
            const isToday = dateObj.toDateString() === new Date().toDateString();
            const isLeave = leaveDates.has(dateStamp);
            const isPast = dateObj < new Date(new Date().setHours(0, 0, 0, 0));

            grid.push(
                <div
                    key={d}
                    className={`cal-cell ${isLeave ? 'leave' : ''} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}
                    onClick={() => !isPast && toggleLeaveDate(dateStamp)}
                    style={{
                        padding: '10px 0', textAlign: 'center', borderRadius: '8px', cursor: isPast ? 'default' : 'pointer',
                        background: isLeave ? 'var(--error-red)' : isToday ? 'var(--primary-blue)' : 'var(--bg-secondary)',
                        color: (isLeave || isToday) ? 'white' : 'var(--text-primary)',
                        opacity: isPast ? 0.5 : 1,
                        fontSize: '14px', fontWeight: '500'
                    }}
                >
                    {d}
                </div>
            );
        }

        return (
            <div className="calendar-container card" style={{ padding: '16px' }}>
                <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <button className="icon-btn-sm" onClick={prevMonth} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><HiChevronLeft size={20} /></button>
                    <span style={{ fontWeight: '600' }}>{displayMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button className="icon-btn-sm" onClick={nextMonth} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><HiChevronRight size={20} /></button>
                </div>
                <div className="cal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                        <div key={day} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>{day}</div>
                    ))}
                    {grid}
                </div>
            </div>
        );
    };

    return (
        <div className="predictor-content fade-in" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <header className="page-header-alt">
                <button className="back-btn-ghost" onClick={() => navigate(-1)}>
                    <HiOutlineChevronLeft />
                </button>
                <h2>Attendance Predictor</h2>
                <div style={{ width: 40 }} /> {/* Spacer */}
            </header>

            <div className="toggle-card card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '24px' }}>
                <div>
                    <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>Consider Unmarked as Present</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Unmarked future classes count as present.</p>
                </div>
                <label className="css-toggle" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={considerUnmarkedAsPresent}
                        onChange={(e) => setConsiderUnmarkedAsPresent(e.target.checked)}
                        style={{ display: 'none' }}
                    />
                    <div style={{
                        width: '40px', height: '24px', background: considerUnmarkedAsPresent ? 'var(--success-green)' : 'var(--bg-secondary)',
                        borderRadius: '12px', position: 'relative', transition: '0.3s'
                    }}>
                        <div style={{
                            width: '20px', height: '20px', background: 'white', borderRadius: '50%',
                            position: 'absolute', top: '2px', left: considerUnmarkedAsPresent ? '18px' : '2px', transition: '0.3s'
                        }} />
                    </div>
                </label>
            </div>

            {renderCalendar()}

            {renderPredictions()}
        </div>
    );
};

export default AttendancePredictorPage;
