import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import SpaceBackground from '../components/SpaceBackground';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import './OtpPage.css';

const OtpPage = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyMfa, resendMfaOtp } = useAuth();
    
    // Email from login navigation
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/auth');
            return;
        }
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [email, navigate]);

    useEffect(() => {
        let timer;
        if (!canResend && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [countdown, canResend]);

    const handleVerify = async (currentOtp) => {
        const fullOtp = currentOtp.join('');
        if (fullOtp.length < 6) return;

        setIsVerifying(true);
        try {
            await verifyMfa(email, fullOtp);
            toast.success('Login successful! Welcome back.');
            // Navigate is handled in App.jsx via AuthContext/isAuthenticated
        } catch (error) {
            setIsVerifying(false);
            const msg = error.response?.data?.message || 'Invalid code. Try again.';
            toast.error(msg);
            // Reset and focus
            setOtp(['', '', '', '', '', '']);
            if (inputRefs.current[0]) inputRefs.current[0].focus();
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        try {
            await resendMfaOtp(email);
            toast.success('MFA Code resent to your email.');
            setCanResend(false);
            setCountdown(60); // Resend in 60s next time
        } catch (error) {
            toast.error('Failed to resend code');
        }
    };

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }

        // Auto verify if all fields filled
        if (newOtp.every(v => v !== '')) {
            handleVerify(newOtp);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const data = e.clipboardData.getData('text');
        if (!/^\d+$/.test(data)) return;

        const paste = data.slice(0, 6).split('');
        const newOtp = [...otp];
        paste.forEach((char, i) => {
            if (i < 6) newOtp[i] = char;
        });
        setOtp(newOtp);
        
        if (newOtp.every(v => v !== '')) {
            handleVerify(newOtp);
        } else {
            const nextIdx = Math.min(paste.length, 5);
            inputRefs.current[nextIdx].focus();
        }
    };

    return (
        <div className="otp-container">
            <SpaceBackground />

            <button className="back-btn" onClick={() => navigate('/auth')}>
                <HiOutlineArrowLeft size={24} />
            </button>

            <div className="otp-content card frosted-glass fade-in-up">
                <div className="eyebrow-chip">SECURITY VERIFICATION</div>

                <h1 className="title">Enter Code</h1>
                <p className="subtitle">
                    A code was sent to <strong>{email}</strong>
                </p>

                <div className="otp-inputs" onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleChange(index, e.target.value)}
                            onKeyDown={e => handleKeyDown(index, e)}
                            className="otp-digit"
                            disabled={isVerifying}
                        />
                    ))}
                </div>

                <div className="actions">
                    <button
                        className="verify-btn btn-primary"
                        onClick={() => handleVerify(otp)}
                        disabled={isVerifying || otp.some(v => v === '')}
                    >
                        {isVerifying ? <div className="spinner-inline" /> : 'Confirm Login'}
                    </button>

                    <div className="resend-section">
                        {canResend ? (
                            <button className="text-btn" onClick={handleResend}>
                                Resend Code
                            </button>
                        ) : (
                            <span className="timer-text">Resend in {countdown}s</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpPage;

