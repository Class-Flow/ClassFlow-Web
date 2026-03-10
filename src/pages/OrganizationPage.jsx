import React from 'react';
import { HiOutlineOfficeBuilding, HiOutlineUsers, HiOutlineMail } from 'react-icons/hi';

const OrganizationPage = () => {
    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Organization</h1>
                    <p className="page-subtitle">University details and contacts</p>
                </div>
                <div style={{ padding: 12, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', color: 'var(--primary-blue)' }}>
                    <HiOutlineOfficeBuilding size={28} />
                </div>
            </div>

            <div className="card" style={{ padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                    width: 100, height: 100,
                    borderRadius: '50%',
                    background: 'var(--bg-secondary)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    margin: '0 auto 24px',
                    border: '2px solid var(--border-color)'
                }}>
                    <HiOutlineOfficeBuilding size={48} color="var(--primary-blue)" />
                </div>
                <h2 style={{ fontSize: 24, marginBottom: 8 }}>ClassFlow University</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Academic Year 2026-2027</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, textAlign: 'left' }}>
                    <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>
                            <HiOutlineUsers size={16} /> Department
                        </div>
                        <div style={{ fontWeight: 600 }}>Computer Science</div>
                    </div>
                    <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>
                            <HiOutlineMail size={16} /> Contact
                        </div>
                        <div style={{ fontWeight: 600 }}>admin@classflow.edu</div>
                    </div>
                </div>
            </div>

            <h3 style={{ marginBottom: 16 }}>Important Links</h3>
            <div style={{ display: 'grid', gap: 12 }}>
                {['Student Portal', 'Library Resources', 'Academic Calendar'].map((link, i) => (
                    <div key={i} className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                        <span style={{ fontWeight: 500 }}>{link}</span>
                        <span style={{ color: 'var(--primary-blue)' }}>&rarr;</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrganizationPage;
