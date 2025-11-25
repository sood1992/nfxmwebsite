import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Facebook,
  Instagram,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import './ConnectAccounts.css';

const ConnectAccounts = () => {
  const navigate = useNavigate();
  const {
    connectedAccounts,
    disconnectAccount,
    loginWithPopup,
    loginWithRedirect,
    fetchAdAccounts,
    isLoading,
  } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const handleConnectMeta = async () => {
    setError(null);
    try {
      await loginWithPopup();
    } catch (err) {
      // Try redirect if popup fails
      loginWithRedirect();
    }
  };

  const handleRefreshAccounts = async () => {
    setRefreshing(true);
    setError(null);
    try {
      await fetchAdAccounts();
    } catch (err) {
      setError('Failed to refresh accounts');
    } finally {
      setRefreshing(false);
    }
  };

  const handleDisconnect = (accountId) => {
    if (window.confirm('Are you sure you want to disconnect this account?')) {
      disconnectAccount(accountId);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'facebook':
        return <Facebook size={20} className="platform-icon facebook" />;
      case 'instagram':
        return <Instagram size={20} className="platform-icon instagram" />;
      default:
        return <Facebook size={20} className="platform-icon facebook" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'disabled':
        return 'status-disabled';
      case 'pending':
      case 'pending review':
        return 'status-pending';
      default:
        return 'status-unknown';
    }
  };

  return (
    <div className="connect-accounts-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Connected Accounts</h1>
          <p>Manage your Meta ad accounts connected to MagicBrief Insights</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={handleRefreshAccounts}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 size={18} className="spinner" />
            ) : (
              <RefreshCw size={18} />
            )}
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary" onClick={handleConnectMeta}>
            <Plus size={18} />
            <span>Connect Account</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="accounts-section">
        <div className="section-header">
          <h2>Meta Ad Accounts</h2>
          <span className="account-count">{connectedAccounts.length} accounts</span>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <Loader2 size={32} className="spinner" />
            <p>Loading accounts...</p>
          </div>
        ) : connectedAccounts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Facebook size={48} />
            </div>
            <h3>No accounts connected</h3>
            <p>Connect your Meta ad accounts to start analyzing your creative performance</p>
            <button className="btn btn-primary" onClick={handleConnectMeta}>
              <Facebook size={18} />
              <span>Connect Meta Account</span>
            </button>
          </div>
        ) : (
          <div className="accounts-grid">
            {connectedAccounts.map((account) => (
              <div key={account.id} className="account-card">
                <div className="account-header">
                  {getPlatformIcon(account.platform)}
                  <div className="account-info">
                    <h3>{account.name}</h3>
                    <span className="account-id">ID: {account.id}</span>
                  </div>
                  <span className={`status-badge ${getStatusColor(account.status)}`}>
                    {account.status || 'Active'}
                  </span>
                </div>

                <div className="account-details">
                  <div className="detail-row">
                    <span className="detail-label">Platform</span>
                    <span className="detail-value">{account.platform}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Currency</span>
                    <span className="detail-value">{account.currency || 'INR'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Timezone</span>
                    <span className="detail-value">{account.timezone || 'Asia/Kolkata'}</span>
                  </div>
                  {account.business && (
                    <div className="detail-row">
                      <span className="detail-label">Business</span>
                      <span className="detail-value">{account.business}</span>
                    </div>
                  )}
                </div>

                <div className="account-actions">
                  <button
                    className="btn btn-link"
                    onClick={() => navigate('/')}
                  >
                    <ExternalLink size={16} />
                    <span>View Dashboard</span>
                  </button>
                  <button
                    className="btn btn-danger-link"
                    onClick={() => handleDisconnect(account.id)}
                  >
                    <Trash2 size={16} />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Add Account Card */}
            <div className="account-card add-card" onClick={handleConnectMeta}>
              <div className="add-content">
                <div className="add-icon">
                  <Plus size={32} />
                </div>
                <h3>Add Another Account</h3>
                <p>Connect more Meta ad accounts</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="info-section">
        <h3>About Meta Integration</h3>
        <div className="info-grid">
          <div className="info-card">
            <CheckCircle size={20} className="info-icon" />
            <div>
              <h4>Secure Connection</h4>
              <p>We use OAuth 2.0 for secure authentication with Meta</p>
            </div>
          </div>
          <div className="info-card">
            <CheckCircle size={20} className="info-icon" />
            <div>
              <h4>Read-Only Access</h4>
              <p>We only read your ad performance data, never modify your ads</p>
            </div>
          </div>
          <div className="info-card">
            <CheckCircle size={20} className="info-icon" />
            <div>
              <h4>Data Privacy</h4>
              <p>Your data is encrypted and never shared with third parties</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectAccounts;
