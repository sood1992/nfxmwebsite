import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Facebook, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import './Login.css';

const Login = () => {
  const { loginWithPopup, loginWithRedirect, loginDemo, isLoading, error } = useAuth();
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();

  const handleMetaLogin = async () => {
    setLoginError(null);
    try {
      await loginWithPopup();
      navigate('/');
    } catch (err) {
      // Try redirect method if popup fails
      loginWithRedirect();
    }
  };

  const handleDemoLogin = async () => {
    setLoginError(null);
    try {
      await loginDemo();
      navigate('/');
    } catch (err) {
      setLoginError('Demo login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo and Header */}
        <div className="login-header">
          <div className="login-logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="login-title">MagicBrief Insights</h1>
          <p className="login-subtitle">Connect your Meta ad accounts to unlock powerful creative analytics</p>
        </div>

        {/* Error Display */}
        {(error || loginError) && (
          <div className="login-error">
            <AlertCircle size={20} />
            <span>{error || loginError}</span>
          </div>
        )}

        {/* Login Options */}
        <div className="login-options">
          {/* Meta Login Button */}
          <button
            className="login-btn meta-btn"
            onClick={handleMetaLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 size={20} className="spinner" />
            ) : (
              <Facebook size={20} />
            )}
            <span>Continue with Meta</span>
          </button>

          <div className="login-divider">
            <span>or</span>
          </div>

          {/* Demo Login Button */}
          <button
            className="login-btn demo-btn"
            onClick={handleDemoLogin}
            disabled={isLoading}
          >
            <Sparkles size={20} />
            <span>Try Demo Mode</span>
          </button>
        </div>

        {/* Features List */}
        <div className="login-features">
          <h3>What you'll get:</h3>
          <ul>
            <li>
              <span className="feature-icon">📊</span>
              <span>Real-time performance metrics from your ad accounts</span>
            </li>
            <li>
              <span className="feature-icon">🎯</span>
              <span>Hook scores, hold scores, and creative analytics</span>
            </li>
            <li>
              <span className="feature-icon">📈</span>
              <span>Compare creatives and identify top performers</span>
            </li>
            <li>
              <span className="feature-icon">🤖</span>
              <span>AI-powered recommendations and insights</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="login-bg">
        <div className="bg-gradient"></div>
        <div className="bg-pattern"></div>
      </div>
    </div>
  );
};

export default Login;
