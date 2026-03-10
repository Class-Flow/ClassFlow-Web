import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SpaceBackground from '../components/SpaceBackground';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import './OtpPage.css';

const OtpPage = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [hasError, setHasError] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const verify = async (currentOtp) => {
        const otpValue = currentOtp.join('');
        if (otpValue.length < 6) {
            triggerError();
            return;
        }

        setIsVerifying(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // For now, any 6-digit code passes
        if (/^\d{6}$/.test(otpValue)) {
            // Success - navigate to home
            navigate('/');
        } else {
            setIsVerifying(false);
            triggerError();
        }
    };

    const triggerError = () => {
        setHasError(true);
        setTimeout(() => setHasError(false), 800);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
    };

    const handleChange = (index, value) => {
        if (value.length > 1) {
            // Handle paste
            const pastedData = value.replace(/\D/g, '').slice(0, 6).split('');
            const newOtp = [...otp];
            pastedData.forEach((char, i) => {
                if (index + i < 6) newOtp[index + i] = char;
            });
            setOtp(newOtp);

            const nextFocusIndex = Math.min(index + pastedData.length, 5);
            inputRefs.current[nextFocusIndex].focus();

            if (newOtp.join('').length === 6) verify(newOtp);
            return;
        }

        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '') {
            if (index < 5) {
                inputRefs.current[index + 1].focus();
            } else {
                verify(newOtp);
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <div className="otp-container">
            <SpaceBackground />

            <button className="back-btn" onClick={() => navigate('/auth')}>
                <HiOutlineArrowLeft size={24} />
            </button>

            <div className="otp-content">
                <div className="eyebrow-chip slide-up">VERIFY ACCOUNT</div>

                <h1 className="title slide-up delay-1">Confirm Your Identity</h1>
                <div className="subtitle-box slide-up delay-2">
                    <p>Enter the 6-digit code sent to your email address to verify this is really you.</p>
                </div>

                <div className={`otp-inputs slide-up delay-3 ${hasError ? 'shake' : ''}`}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            type="text"
                            maxLength={6}
                            value={digit}
                            onChange={e => handleChange(index, e.target.value)}
                            onKeyDown={e => handleKeyDown(index, e)}
                            className={`otp-digit ${hasError ? 'error' : ''}`}
                            disabled={isVerifying}
                        />
                    ))}
                </div>

                {hasError && (
                    <div className="error-text fade-in">Invalid code. Please try again.</div>
                )}

                <div className="actions slide-up delay-4">
                    <button
                        className="verify-btn"
                        onClick={() => verify(otp)}
                        disabled={isVerifying}
                    >
                        {isVerifying ? <div className="spinner" /> : 'Verify Code'}
                    </button>

                    <button className="cancel-btn" onClick={() => navigate('/auth')}>
                        Cancel and Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OtpPage;
