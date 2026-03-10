import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HiArrowLeft,
    HiOutlineShieldCheck,
    HiOutlineHand,
    HiOutlineInformationCircle,
    HiOutlineRefresh,
    HiOutlineDesktopComputer,
    HiOutlineLockClosed,
    HiOutlineUserCircle,
    HiOutlineDocumentText,
    HiCheckCircle
} from 'react-icons/hi';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
    const navigate = useNavigate();

    return (
        <div className="privacy-page-container">
            <div className="privacy-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <HiArrowLeft />
                </button>
                <div className="header-title-container">
                    <div className="header-icon-box">
                        <HiOutlineShieldCheck />
                    </div>
                    <h1>Privacy Policy</h1>
                </div>
            </div>

            <div className="privacy-content">
                <div className="privacy-hero-card">
                    <div className="last-updated-chip">Last Updated: February 9, 2025</div>
                    <h2>Your Privacy Matters</h2>
                    <p>We respect your privacy and are committed to protecting your personal data.</p>
                </div>

                <div className="privacy-section-card">
                    <div className="section-header">
                        <div className="section-icon blue-icon"><HiOutlineHand /></div>
                        <div>
                            <span className="section-num">Section 1</span>
                            <h3>Introduction</h3>
                        </div>
                    </div>
                    <p>Welcome to ClassFlow. We respect your privacy and are committed to protecting your personal data when you use our services.</p>
                </div>

                <div className="privacy-section-card">
                    <div className="section-header">
                        <div className="section-icon purple-icon"><HiOutlineInformationCircle /></div>
                        <div>
                            <span className="section-num">Section 2</span>
                            <h3>Information We Collect</h3>
                        </div>
                    </div>
                    <div className="info-sub-cards">
                        <div className="sub-card">
                            <div className="sub-icon user-icon"><HiOutlineUserCircle /></div>
                            <div className="sub-text">
                                <h4>Personal Information</h4>
                                <p>Name, email address, and password for account management</p>
                            </div>
                        </div>
                        <div className="sub-card">
                            <div className="sub-icon acad-icon"><HiOutlineDocumentText /></div>
                            <div className="sub-text">
                                <h4>Academic Data</h4>
                                <p>Course details, event information, task data, and uploaded files</p>
                            </div>
                        </div>
                        <div className="sub-card">
                            <div className="sub-icon usage-icon"><HiOutlineRefresh /></div>
                            <div className="sub-text">
                                <h4>Usage Patterns</h4>
                                <p>Task duration, completion history, and productivity analytics</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="privacy-section-card">
                    <div className="section-header">
                        <div className="section-icon teal-icon"><HiOutlineRefresh /></div>
                        <div>
                            <span className="section-num">Section 3</span>
                            <h3>How We Use Your Information</h3>
                        </div>
                    </div>
                    <p>We use your data to provide our scheduling features, analyze task patterns to help prevent burnout, and generate AI-powered study plans.</p>
                </div>

                <div className="privacy-section-card">
                    <div className="section-header">
                        <div className="section-icon amber-icon"><HiOutlineDesktopComputer /></div>
                        <div>
                            <span className="section-num">Section 4</span>
                            <h3>AI & Third-Party Services</h3>
                        </div>
                    </div>
                    <div className="important-notice">
                        <h4><HiOutlineInformationCircle /> Important Notice</h4>
                        <p>We use Google Gemini AI to create personalized study plans. When you request a study plan, your task data is sent to Google's servers. Google does not use this data to train their models.</p>
                    </div>
                </div>

                <div className="privacy-section-card">
                    <div className="section-header">
                        <div className="section-icon green-icon"><HiOutlineShieldCheck /></div>
                        <div>
                            <span className="section-num">Section 5</span>
                            <h3>Data Security</h3>
                        </div>
                    </div>
                    <p>We implement security measures to protect your information from unauthorized access. However, no internet transmission method is 100% secure.</p>
                </div>

                <div className="privacy-section-card">
                    <div className="section-header">
                        <div className="section-icon purple-icon"><HiCheckCircle /></div>
                        <div>
                            <span className="section-num">Section 6</span>
                            <h3>Your Rights</h3>
                        </div>
                    </div>
                    <p>You have the right to access your data, correct inaccurate information, and request deletion of your account and all associated data.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
