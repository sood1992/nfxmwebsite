import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart2,
  GitCompare,
  Bot,
  Settings,
  ChevronDown,
  ChevronUp,
  Plus,
  Plane,
  Anchor,
  Trophy,
  Video,
  RefreshCw,
  Megaphone,
  Image,
  FileText,
  Monitor,
  Layers,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Link2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { selectedAccount, setSelectedAccount, adAccounts } = useApp();
  const { user, logout, connectedAccounts } = useAuth();
  const [isReportsOpen, setIsReportsOpen] = useState(true);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const mainNavItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/overview', icon: BarChart2, label: 'Overview' },
    { path: '/compare', icon: GitCompare, label: 'Compare' },
    { path: '/copilot', icon: Bot, label: 'Copilot', badge: 'Beta' },
  ];

  const reportItems = [
    { path: '/reports/check-landing-page', icon: Plane, label: 'Check Landing Page' },
    { path: '/reports/top-hooks', icon: Anchor, label: 'Top Hooks' },
    { path: '/reports/top-creatives', icon: Trophy, label: 'Top Creatives' },
    { path: '/reports/video-breakdown', icon: Video, label: 'Video Breakdown' },
    { path: '/reports/iterate-on-hook', icon: RefreshCw, label: 'Iterate on Hook' },
    { path: '/reports/iterate-on-cta', icon: Megaphone, label: 'Iterate on CTA' },
    { path: '/reports/static-breakdown', icon: Image, label: 'Static Breakdown' },
    { path: '/reports/top-copy', icon: FileText, label: 'Top Copy' },
    { path: '/reports/top-landing-page', icon: Monitor, label: 'Top Landing Page' },
    { path: '/reports/compare-formats', icon: Layers, label: 'Compare Formats' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const accounts = connectedAccounts?.length > 0 ? connectedAccounts : adAccounts;

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Logo & Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {!isCollapsed && (
            <div className="header-nav">
              <span className="nav-item active">Insights</span>
              <span className="nav-item">Inspire</span>
              <span className="nav-item">Briefs</span>
            </div>
          )}
        </div>
        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Account Selector */}
      <div className="account-selector">
        <button
          className="account-button"
          onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
        >
          <div className="account-icon" style={{ backgroundColor: '#FFD700' }}>
            {selectedAccount?.name?.charAt(0) || 'A'}
          </div>
          {!isCollapsed && (
            <>
              <div className="account-info">
                <span className="account-name">{selectedAccount?.name || 'Select Account'}</span>
                <span className="account-platform">{selectedAccount?.platform || 'Connect an account'}</span>
              </div>
              <ChevronDown size={16} className={`chevron ${isAccountDropdownOpen ? 'open' : ''}`} />
            </>
          )}
        </button>

        {isAccountDropdownOpen && !isCollapsed && (
          <div className="account-dropdown">
            {accounts?.length > 0 ? (
              <>
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    className={`account-option ${selectedAccount?.id === account.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedAccount(account);
                      setIsAccountDropdownOpen(false);
                    }}
                  >
                    <div className="account-icon small" style={{ backgroundColor: '#FFD700' }}>
                      {account.name?.charAt(0) || 'A'}
                    </div>
                    <div className="account-info">
                      <span className="account-name">{account.name}</span>
                      <span className="account-platform">{account.platform}</span>
                    </div>
                  </button>
                ))}
                <div className="dropdown-divider" />
                <button
                  className="account-option add-account"
                  onClick={() => {
                    setIsAccountDropdownOpen(false);
                    navigate('/connect-accounts');
                  }}
                >
                  <div className="account-icon small add">
                    <Plus size={14} />
                  </div>
                  <span>Connect New Account</span>
                </button>
              </>
            ) : (
              <button
                className="account-option add-account"
                onClick={() => {
                  setIsAccountDropdownOpen(false);
                  navigate('/connect-accounts');
                }}
              >
                <div className="account-icon small add">
                  <Plus size={14} />
                </div>
                <span>Connect Meta Account</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {mainNavItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <item.icon size={20} />
                {!isCollapsed && (
                  <>
                    <span>{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Reports Section */}
        <div className="nav-section">
          <button
            className="section-header"
            onClick={() => setIsReportsOpen(!isReportsOpen)}
          >
            {!isCollapsed && (
              <>
                <span className="section-title">REPORTS</span>
                <div className="section-actions">
                  <button className="section-action" title="Sort reports">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button className="section-action" title="Add report">
                    <Plus size={16} />
                  </button>
                  {isReportsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </>
            )}
          </button>

          {isReportsOpen && (
            <ul className="nav-list reports-list">
              {reportItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    <item.icon size={18} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {/* Connect Accounts Link */}
        <NavLink to="/connect-accounts" className="nav-link connect-link">
          <Link2 size={20} />
          {!isCollapsed && <span>Connected Accounts</span>}
        </NavLink>

        {/* Settings Link */}
        <NavLink to="/settings" className="nav-link settings-link">
          <Settings size={20} />
          {!isCollapsed && <span>Ad Account Settings</span>}
        </NavLink>

        {!isCollapsed && (
          <div className="trial-banner">
            <div className="trial-info">
              <span className="trial-label">Pro plan trial</span>
              <span className="trial-days">Trial ends in 11 days</span>
            </div>
            <button className="trial-btn">Select Plan</button>
          </div>
        )}

        {/* User Menu */}
        <div className="user-menu">
          <button
            className="user-button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <div className="user-avatar">
              <User size={16} />
            </div>
            {!isCollapsed && (
              <>
                <div className="user-info">
                  <span className="user-name">{user?.name || 'User'}</span>
                  <span className="user-email">{user?.email || ''}</span>
                </div>
                <ChevronDown size={16} className={`chevron ${isUserMenuOpen ? 'open' : ''}`} />
              </>
            )}
          </button>

          {isUserMenuOpen && !isCollapsed && (
            <div className="user-dropdown">
              <button className="user-option" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
