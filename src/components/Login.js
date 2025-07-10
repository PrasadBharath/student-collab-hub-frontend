import React, { useState, useEffect, useRef } from 'react';
import './Login.css';

// Use Heroicons if available, otherwise fallback to SVG
const EyeIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.249-2.568A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.293 5.03M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6.364 6.364L19.07 4.93" />
  </svg>
);

const Login = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    department: '',
    year: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // const [token, setToken] = useState(''); // Removed unused variable
  const loginRadio = useRef(null);
  const signupRadio = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetError, setResetError] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1: enter email, 2: enter new password
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  useEffect(() => {
    // Initialize particles.js
    if (window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 48, density: { enable: true, value_area: 900 } },
          color: { value: '#fff' },
          shape: { type: 'circle' },
          opacity: { value: 0.18, random: true },
          size: { value: 3, random: true },
          line_linked: { enable: false },
          move: {
            enable: true,
            speed: 0.6,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: { 
          detect_on: 'canvas', 
          events: { 
            onhover: { enable: false }, 
            onclick: { enable: false }, 
            resize: true 
          } 
        },
        retina_detect: true
      });
    }
  }, []);

  // Tab switcher logic
  const handleTabSwitch = (login) => {
    setIsLogin(login);
    setError('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      department: '',
      year: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user starts typing
  };

  // Helper to extract error message from backend response
  function extractErrorMessage(detail) {
    if (Array.isArray(detail)) {
      return detail.map(e => e.msg).join(' ');
    } else if (typeof detail === 'string') {
      return detail;
    } else {
      return 'An error occurred.';
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (isLogin) {
        // LOGIN: Send POST to Node.js/Express backend
        console.log('Attempting login with', formData.email);
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
        console.log('Login response:', res); // This logs the raw Response object
        const data = await res.json();
        alert('Login response data: ' + JSON.stringify(data));
        console.log('Login response data:', data, typeof data);
        console.log('Token to store:', data && data.access_token, typeof (data && data.access_token));
        if (!res.ok) {
          setError(extractErrorMessage(data.message || data.detail) || 'Login failed.');
        } else {
          // Clean up any previous bad token
          if (localStorage.getItem('token') === 'undefined') {
            localStorage.removeItem('token');
          }
          // Log the token value
          if (data && typeof data.access_token === 'string' && data.access_token.length > 0) {
            localStorage.setItem('token', data.access_token);
            setSuccess('Login successful!');
            onLoginSuccess && onLoginSuccess({ email: formData.email, token: data.access_token });
          } else {
            setError('Login succeeded but no access_token returned!');
            console.error('No access_token in response:', data);
          }
        }
      } else {
        // SIGNUP: Send POST to Node.js/Express backend
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            department: formData.department,
            year: formData.year
          })
        });
        const data = await res.json();
        if (!res.ok) {
          setError(extractErrorMessage(data.detail) || 'Signup failed.');
        } else {
          setSuccess('Signup successful! Please switch to Login.');
          alert('Your account has been created! Please login.');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        setForgotError(extractErrorMessage(data.detail) || 'User not found.');
      } else {
        setForgotStep(2);
      }
    } catch (err) {
      setForgotError('Network error. Please try again.');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetError('');
    setForgotSuccess('');
    if (!resetPassword || resetPassword.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }
    if (resetPassword !== resetConfirm) {
      setResetError('Passwords do not match.');
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp: '', new_password: resetPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setResetError(extractErrorMessage(data.detail) || 'Password reset failed.');
      } else {
        setForgotSuccess('Password reset successful! Please login.');
        setForgotStep(1);
        setForgotEmail('');
        setResetPassword('');
        setResetConfirm('');
        setTimeout(() => closeForgotModal(), 2000);
      }
    } catch (err) {
      setResetError('Network error. Please try again.');
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail('');
    setResetPassword('');
    setResetConfirm('');
    setResetError('');
    setForgotStep(1);
    setForgotSuccess('');
  };

  return (
    <div id="login-bg" className="login-container">
      {/* Particles.js background */}
      <div id="particles-js" className="particles-bg"></div>
      
      {/* SVG Illustrations */}
      <div className="svg-illustration coding-illustration">
        <svg viewBox="0 0 800 600" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="400" cy="570" rx="320" ry="30" fill="#0072ff" fillOpacity="0.13"/>
          <rect x="180" y="120" width="440" height="320" rx="32" fill="#fff" fillOpacity="0.7"/>
          <rect x="220" y="160" width="360" height="40" rx="12" fill="#0072ff" fillOpacity="0.18"/>
          <rect x="220" y="220" width="360" height="20" rx="8" fill="#0072ff" fillOpacity="0.13"/>
          <rect x="220" y="260" width="200" height="20" rx="8" fill="#0072ff" fillOpacity="0.13"/>
          <rect x="220" y="300" width="280" height="20" rx="8" fill="#0072ff" fillOpacity="0.13"/>
          <rect x="220" y="340" width="180" height="20" rx="8" fill="#0072ff" fillOpacity="0.13"/>
          <circle cx="600" cy="200" r="24" fill="#0072ff" fillOpacity="0.13"/>
          <circle cx="250" cy="180" r="12" fill="#0072ff" fillOpacity="0.13"/>
          <rect x="320" y="400" width="160" height="32" rx="10" fill="#0072ff" fillOpacity="0.13"/>
        </svg>
      </div>
      
      <div className="svg-illustration student-illustration">
        <svg viewBox="0 0 800 600" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="200" cy="570" rx="180" ry="24" fill="#0072ff" fillOpacity="0.13"/>
          <rect x="120" y="320" width="120" height="40" rx="12" fill="#fff" fillOpacity="0.7"/>
          <rect x="140" y="340" width="80" height="16" rx="8" fill="#0072ff" fillOpacity="0.13"/>
          <ellipse cx="180" cy="300" rx="32" ry="32" fill="#0072ff" fillOpacity="0.18"/>
          <rect x="160" y="260" width="40" height="40" rx="12" fill="#fff" fillOpacity="0.7"/>
          <rect x="170" y="270" width="20" height="20" rx="6" fill="#0072ff" fillOpacity="0.18"/>
          <ellipse cx="180" cy="250" rx="18" ry="10" fill="#0072ff" fillOpacity="0.13"/>
        </svg>
      </div>
      
      <div className="svg-illustration graduation-illustration">
        <svg viewBox="0 0 200 120" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="60" width="120" height="24" rx="8" fill="#0072ff" fillOpacity="0.13"/>
          <rect x="80" y="40" width="40" height="20" rx="6" fill="#fff" fillOpacity="0.7"/>
          <ellipse cx="100" cy="30" rx="32" ry="12" fill="#0072ff" fillOpacity="0.18"/>
          <rect x="90" y="20" width="20" height="10" rx="3" fill="#0072ff" fillOpacity="0.13"/>
        </svg>
      </div>
      
      {/* Floating bubbles */}
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      
      <div id="auth-section" className="auth-section">
        <div className="wrapper">
          <div className="title">Student Collaboration Hub</div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}
          
          <div className="form-container">
            <div className="slide-controls">
              <input
                type="radio"
                name="slide"
                id="login"
                ref={loginRadio}
                checked={isLogin}
                onChange={() => handleTabSwitch(true)}
                style={{ display: 'none' }}
              />
              <input
                type="radio"
                name="slide"
                id="signup"
                ref={signupRadio}
                checked={!isLogin}
                onChange={() => handleTabSwitch(false)}
                style={{ display: 'none' }}
              />
              <label
                htmlFor="login"
                className={`slide login${isLogin ? ' active' : ''}`}
                style={{ color: isLogin ? '#fff' : '#000', cursor: isLogin ? 'default' : 'pointer', userSelect: isLogin ? 'none' : 'auto' }}
              >
                Login
              </label>
              <label
                htmlFor="signup"
                className={`slide signup${!isLogin ? ' active' : ''}`}
                style={{ color: !isLogin ? '#fff' : '#000', cursor: !isLogin ? 'default' : 'pointer', userSelect: !isLogin ? 'none' : 'auto' }}
              >
                Signup
              </label>
              <div
                className="slider-tab"
                style={{ left: isLogin ? 0 : '50%' }}
              ></div>
            </div>
            
            <div className="form-inner" style={{ marginLeft: isLogin ? '0%' : '-100%' }}>
              {/* Login Form */}
              <form onSubmit={handleSubmit} className="login" style={{ width: '100%' }}>
                <div className="field">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="field" style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <span
                    onClick={() => setShowPassword((v) => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' }}
                    tabIndex={0}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </span>
                </div>
                <div className="pass-link">
                  <button type="button" style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: 0 }} onClick={() => setShowForgotModal(true)}>
                    Forgot password?
                  </button>
                </div>
                <div className="field btn">
                  <div className="btn-layer"></div>
                  <input 
                    type="submit" 
                    value={loading ? "Logging in..." : "Login"}
                    disabled={loading}
                  />
                </div>
                <div className="signup-link">
                  Not a member? <button type="button" style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: 0, textDecoration: 'underline' }} onClick={e => { e.preventDefault(); handleTabSwitch(false); }}>Signup now</button>
                </div>
              </form>
              
              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="signup" style={{ width: '100%' }}>
                <div className="field">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="field">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={e => {
                      if (/^\d{0,10}$/.test(e.target.value)) handleInputChange(e);
                    }}
                    required
                    maxLength={10}
                    pattern="\d{10}"
                  />
                </div>
                <div className="field">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="department-select"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                  </select>
                </div>
                <div className="field">
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    className="year-select"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div className="field" style={{ position: 'relative' }}>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <span
                    onClick={() => setShowSignupPassword((v) => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' }}
                    tabIndex={0}
                    aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSignupPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </span>
                </div>
                <div className="field" style={{ position: 'relative' }}>
                  <input
                    type={showSignupConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <span
                    onClick={() => setShowSignupConfirm((v) => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' }}
                    tabIndex={0}
                    aria-label={showSignupConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showSignupConfirm ? <EyeIcon /> : <EyeOffIcon />}
                  </span>
                </div>
                <div className="field btn">
                  <div className="btn-layer"></div>
                  <input 
                    type="submit" 
                    value={loading ? "Creating account..." : "Signup"}
                    disabled={loading}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 340, width: '90vw', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', position: 'relative' }}>
            <button onClick={closeForgotModal} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18, color: '#2563eb' }}>Reset Password</h2>
            {forgotStep === 1 && (
              <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label style={{ fontWeight: 500, color: '#333' }}>Enter your registered email address:</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => { setForgotEmail(e.target.value); setForgotError(''); }}
                  placeholder="Email address"
                  required
                  style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16 }}
                />
                {forgotError && <span style={{ color: '#c00', fontSize: 13 }}>{forgotError}</span>}
                <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, marginTop: 6, cursor: 'pointer' }}>
                  Next
                </button>
              </form>
            )}
            {forgotStep === 2 && (
              <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label style={{ fontWeight: 500, color: '#333' }}>Set your new password:</label>
                <input
                  type="password"
                  value={resetPassword}
                  onChange={e => setResetPassword(e.target.value)}
                  placeholder="New password"
                  minLength={6}
                  required
                  style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16 }}
                />
                <input
                  type="password"
                  value={resetConfirm}
                  onChange={e => setResetConfirm(e.target.value)}
                  placeholder="Confirm new password"
                  minLength={6}
                  required
                  style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16 }}
                />
                {resetError && <span style={{ color: '#c00', fontSize: 13 }}>{resetError}</span>}
                {forgotSuccess && <span style={{ color: '#22c55e', fontSize: 13 }}>{forgotSuccess}</span>}
                <button type="submit" style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, marginTop: 6, cursor: 'pointer' }}>
                  Change Password & Login
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login; 