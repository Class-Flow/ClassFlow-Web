import React, { useState, useEffect } from 'react';
import { HiOutlineOfficeBuilding, HiOutlineMap, HiOutlineLocationMarker, HiOutlinePencilAlt, HiCheck } from 'react-icons/hi';
import { toast } from 'react-toastify';

const OrganizationPage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [orgData, setOrgData] = useState(() => {
        const saved = localStorage.getItem('user_org');
        if (saved) return JSON.parse(saved);
        return {
            name: 'ClassFlow University',
            address: '123 Academic Way',
            city: 'Innovation City',
            state: 'Tech State'
        };
    });

    const handleChange = (e) => {
        setOrgData({ ...orgData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setIsEditing(false);
        localStorage.setItem('user_org', JSON.stringify(orgData));
        toast.success("Organization details updated successfully!");
    };

    return (
        <div className="page-container fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">My Organization</h1>
                    <p className="page-subtitle">University details and location</p>
                </div>
                <button 
                    onClick={isEditing ? handleSave : () => setIsEditing(true)} 
                    className="icon-btn" 
                    style={{ background: 'var(--primary-blue)', color: 'white', padding: '10px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, gap: '8px' }}
                >
                    {isEditing ? <><HiCheck /> Save</> : <><HiOutlinePencilAlt /> Edit</>}
                </button>
            </div>

            <div className="card" style={{ padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                    width: 100, height: 100,
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.1)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    margin: '0 auto 24px',
                    border: '2px dashed var(--primary-blue)'
                }}>
                    <HiOutlineOfficeBuilding size={48} color="var(--primary-blue)" />
                </div>
                
                {isEditing ? (
                    <div style={{ maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="input-group">
                            <label>Institution Name</label>
                            <input type="text" name="name" value={orgData.name} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                        </div>
                        <div className="input-group">
                            <label>Address</label>
                            <input type="text" name="address" value={orgData.address} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                        </div>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>City</label>
                                <input type="text" name="city" value={orgData.city} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                            </div>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>State</label>
                                <input type="text" name="state" value={orgData.state} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 style={{ fontSize: 24, marginBottom: 8, color: 'var(--text-primary)' }}>{orgData.name}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Academic Institution</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, textAlign: 'left' }}>
                            <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>
                                    <HiOutlineMap size={16} /> Address
                                </div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{orgData.address}</div>
                            </div>
                            <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>
                                    <HiOutlineLocationMarker size={16} /> Location
                                </div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{orgData.city}, {orgData.state}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <h3 style={{ marginBottom: 16, color: 'var(--text-primary)' }}>Important Links</h3>
            <div style={{ display: 'grid', gap: 12 }}>
                {['Student Portal', 'Library Resources'].map((link, i) => (
                    <div key={i} className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{link}</span>
                        <span style={{ color: 'var(--primary-blue)' }}>&rarr;</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrganizationPage;
