import { useState, useEffect } from 'react';
import { HiOutlineClock, HiOutlineDocumentText } from 'react-icons/hi';
import { attendanceService } from '../services/attendanceService';
import './TimelinePage.css';

const TimelinePage = () => {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                // Using attendance details as a mock for timeline events for now
                // In a real app we would have a specific timeline endpoint
                const details = await attendanceService.getAttendanceDetails();

                // Format details into timeline events
                const events = [];
                Object.entries(details).forEach(([subject, data]) => {
                    data.history?.forEach(record => {
                        events.push({
                            id: `${subject}-${record.date}`,
                            title: subject,
                            type: record.status.toLowerCase(),
                            date: new Date(record.date),
                            description: `Marked as ${record.status}`
                        });
                    });
                });

                // Sort by date descending
                events.sort((a, b) => b.date - a.date);
                setTimeline(events);
            } catch (err) {
                console.error("Error fetching timeline:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTimeline();
    }, []);

    const getTypeColor = (type) => {
        switch (type) {
            case 'present': return 'var(--success-green)';
            case 'absent': return 'var(--error-red)';
            case 'cancelled': return 'var(--secondary-purple)';
            default: return 'var(--primary-blue)';
        }
    };

    if (loading) return <div className="loading-screen">Loading timeline...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Timeline</h1>
                    <p className="page-subtitle">Your academic journey and recent activities</p>
                </div>
            </div>

            <div className="timeline-container">
                {timeline.length === 0 ? (
                    <div className="empty-state">
                        <HiOutlineClock size={48} style={{ opacity: 0.5, marginBottom: 16 }} />
                        <h3>No Activity Yet</h3>
                        <p>Your timeline will populate as you attend classes and complete tasks.</p>
                    </div>
                ) : (
                    <div className="timeline">
                        {timeline.map((event, index) => (
                            <div key={event.id} className="timeline-item">
                                <div className="timeline-marker" style={{ borderColor: getTypeColor(event.type) }}>
                                    <div className="timeline-dot" style={{ backgroundColor: getTypeColor(event.type) }} />
                                </div>

                                <div className="timeline-content card">
                                    <div className="timeline-date">
                                        {event.date.toLocaleDateString(undefined, {
                                            weekday: 'short', month: 'short', day: 'numeric'
                                        })}
                                    </div>
                                    <h3 className="timeline-title" style={{ color: getTypeColor(event.type) }}>
                                        {event.title}
                                    </h3>
                                    <p className="timeline-desc">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimelinePage;
