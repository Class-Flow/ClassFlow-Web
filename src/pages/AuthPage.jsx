import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiEye, HiEyeOff, HiOutlineAcademicCap } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import './AuthPage.css';
import appLogo from '../assets/selogo.png';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const AuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(location.state?.isLogin ?? true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'student',
        avatar: ''
    });

    const [mfaStep, setMfaStep] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [otp, setOtp] = useState('');

    const { login, verifyMfa, register, googleLogin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mfaStep) {
                // Submit MFA OTP
                await verifyMfa(loginEmail, otp);
                toast.success('Welcome back!');
                return;
            }

            if (isLogin) {
                const response = await login({ email: formData.email, password: formData.password });
                if (response.requiresMfa) {
                    toast.success(response.message || 'MFA Code sent to your email.');
                    setLoginEmail(formData.email);
                    setMfaStep(true);
                } else {
                    toast.success('Welcome back!');
                }
            } else {
                await register(formData);
                toast.success('Account created successfully! Please sign in.');
                setIsLogin(true); // Switch to login screen
                setFormData(prev => ({ ...prev, password: '' })); // Clear password
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.message || 'Authentication failed';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        if (!GOOGLE_CLIENT_ID) {
            toast.error('Google Sign-In is not configured');
            return;
        }

        if (!window.google) {
            toast.error('Google Sign-In is loading, please try again');
            return;
        }

        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: async (response) => {
                setLoading(true);
                try {
                    await googleLogin(response.credential);
                    toast.success('Welcome!');
                } catch (error) {
                    const msg = error.response?.data?.message || error.message || 'Google sign-in failed';
                    toast.error(msg);
                } finally {
                    setLoading(false);
                }
            },
        });

        window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // If One Tap is blocked/skipped, fall back to the button-style popup
                window.google.accounts.id.renderButton(
                    document.getElementById('google-signin-fallback'),
                    { theme: 'outline', size: 'large', width: '100%' }
                );
                // Auto-click the rendered button
                const fallback = document.getElementById('google-signin-fallback');
                if (fallback) {
                    const btn = fallback.querySelector('div[role="button"]');
                    if (btn) btn.click();
                }
            }
        });
    };

    return (
        <div className="auth-page-web fade-in">
            <div className="auth-container-web">
                {/* Logo Section */}
                <div className="logo-box-web">
                    <div className="auth-logo-circle">
                        <div className="auth-logo-ring"></div>
                        <img src={appLogo} alt="Logo" className="auth-cap-icon"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = '<svg viewBox="0 0 24 24" fill="none" class="auth-cap-icon-svg" stroke="currentColor" stroke-width="1.5"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm0 0V20"/></svg>';
                            }}
                        />
                    </div>
                    <h2 className="auth-brand-name">ClassFlow</h2>
                </div>

                <div className="auth-header-web">
                    <h1>{mfaStep ? 'Two-Factor Authentication' : isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p>{mfaStep ? 'Enter the code sent to your email' : isLogin ? 'Sign in to continue' : 'Join our community today'}</p>
                </div>

                {mfaStep ? (
                    <form className="auth-form-web" onSubmit={handleSubmit}>
                         <div className="input-group-web">
                            <HiOutlineLockClosed className="input-icon" />
                            <input
                                type="text"
                                placeholder="6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-filled-auth" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify & Sign In'}
                        </button>
                        <button type="button" className="auth-footer-web toggle-btn-web" style={{marginTop: 16}} onClick={() => setMfaStep(false)}>
                            Cancel
                        </button>
                    </form>
                ) : (
                    <form className="auth-form-web" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="signup-grid">
                                <div className="input-group-web">
                                    <HiOutlineUser className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="input-group-web">
                                    <HiOutlineUser className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="input-group-web select-group-web" style={{ gridColumn: '1 / -1' }}>
                                    <HiOutlineAcademicCap className="input-icon" />
                                    <select 
                                        value={formData.role} 
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="input-group-web">
                            <HiOutlineMail className="input-icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="input-group-web">
                            <HiOutlineLockClosed className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-eye"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <HiEyeOff /> : <HiEye />}
                            </button>
                        </div>

                        {isLogin && <div className="forgot-password-web" onClick={() => navigate('/forgot-password')}>Forgot Password?</div>}

                        <button type="submit" className="btn-filled-auth" disabled={loading}>
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        </button>
                    </form>
                )}

                {!mfaStep && (
                    <div className="auth-footer-web">
                        <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                        <button className="toggle-btn-web" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>
                )}

                <div className="divider-web">
                    <div className="line" />
                    <span>OR</span>
                    <div className="line" />
                </div>

                <button className="google-btn-web" onClick={handleGoogleLogin} disabled={loading}>
                    <FcGoogle className="google-icon" />
                    <span>Continue with Google</span>
                </button>
                <div id="google-signin-fallback" style={{ display: 'none' }}></div>
            </div>
        </div>
    );
};

export default AuthPage;

