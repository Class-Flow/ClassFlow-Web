import React from 'react';
import { HiOutlineShieldCheck } from 'react-icons/hi';

const PrivacyPolicyPage = () => {
    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Privacy Policy</h1>
                    <p className="page-subtitle">How we handle your data</p>
                </div>
                <div style={{ padding: 12, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', color: 'var(--primary-blue)' }}>
                    <HiOutlineShieldCheck size={28} />
                </div>
            </div>

            <div className="card" style={{ padding: '32px', lineHeight: 1.6 }}>
                <h2 style={{ marginBottom: 16, color: 'var(--primary-blue)' }}>Data Collection</h2>
                <p style={{ marginBottom: 24, color: 'var(--text-secondary)' }}>
                    We collect information you provide directly to us, such as when you create or modify your account,
                    request on-demand services, contact customer support, or otherwise communicate with us.
                </p>

                <h2 style={{ marginBottom: 16, color: 'var(--primary-blue)' }}>Use of Data</h2>
                <p style={{ marginBottom: 24, color: 'var(--text-secondary)' }}>
                    We may use the information we collect about you to:
                </p>
                <ul style={{ marginBottom: 24, color: 'var(--text-secondary)', paddingLeft: 24 }}>
                    <li style={{ marginBottom: 8 }}>Provide, maintain, and improve our services</li>
                    <li style={{ marginBottom: 8 }}>Perform internal operations</li>
                    <li style={{ marginBottom: 8 }}>Send you communications we think will be of interest to you</li>
                    <li style={{ marginBottom: 8 }}>Personalize and improve the Services</li>
                </ul>

                <h2 style={{ marginBottom: 16, color: 'var(--primary-blue)' }}>Data Security</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access,
                    disclosure, alteration and destruction. All academic data is encrypted at rest and in transit.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
