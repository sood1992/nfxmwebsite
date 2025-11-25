import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import './AuthCallback.css';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleAuthCallback } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        setStatus('error');
        setErrorMessage(errorDescription || 'Authentication was cancelled or failed');
        return;
      }

      if (!code) {
        setStatus('error');
        setErrorMessage('No authorization code received');
        return;
      }

      try {
        const success = await handleAuthCallback(code, state);
        if (success) {
          setStatus('success');
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          setStatus('error');
          setErrorMessage('Failed to complete authentication');
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage(err.message || 'An unexpected error occurred');
      }
    };

    processCallback();
  }, [searchParams, handleAuthCallback, navigate]);

  return (
    <div className="callback-page">
      <div className="callback-container">
        {status === 'processing' && (
          <>
            <Loader2 size={48} className="spinner" />
            <h2>Connecting your account...</h2>
            <p>Please wait while we complete the authentication</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={48} className="success-icon" />
            <h2>Successfully Connected!</h2>
            <p>Redirecting to dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={48} className="error-icon" />
            <h2>Connection Failed</h2>
            <p>{errorMessage}</p>
            <button className="retry-btn" onClick={() => navigate('/login')}>
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
