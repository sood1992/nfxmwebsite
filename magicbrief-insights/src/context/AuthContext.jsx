import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { metaAuth } from '../services/metaAuth';
import { metaApi } from '../services/metaApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is authenticated
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const authenticated = metaAuth.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const userData = metaAuth.getUserData();
        setUser(userData);

        // Load connected accounts from localStorage
        const savedAccounts = localStorage.getItem('meta_ad_accounts');
        if (savedAccounts) {
          setConnectedAccounts(JSON.parse(savedAccounts));
        } else {
          // Fetch accounts from API
          await fetchAdAccounts();
        }
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch ad accounts from Meta API
  const fetchAdAccounts = async () => {
    try {
      const accounts = await metaApi.getAdAccounts();
      setConnectedAccounts(accounts);
      localStorage.setItem('meta_ad_accounts', JSON.stringify(accounts));
      return accounts;
    } catch (err) {
      console.error('Error fetching ad accounts:', err);
      return [];
    }
  };

  // Login with redirect
  const loginWithRedirect = useCallback(() => {
    const loginUrl = metaAuth.getLoginUrl();
    window.location.href = loginUrl;
  }, []);

  // Login with popup
  const loginWithPopup = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await metaAuth.loginWithPopup();
      setIsAuthenticated(true);

      const userData = metaAuth.getUserData();
      setUser(userData);

      await fetchAdAccounts();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle OAuth callback
  const handleAuthCallback = useCallback(async (code, state) => {
    setIsLoading(true);
    setError(null);
    try {
      // Verify state for CSRF protection
      if (!metaAuth.verifyState(state)) {
        throw new Error('Invalid state parameter');
      }

      // Exchange code for token
      await metaAuth.exchangeCodeForToken(code);
      setIsAuthenticated(true);

      const userData = metaAuth.getUserData();
      setUser(userData);

      await fetchAdAccounts();
      return true;
    } catch (err) {
      console.error('Auth callback error:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    metaAuth.logout();
    setIsAuthenticated(false);
    setUser(null);
    setConnectedAccounts([]);
  }, []);

  // Connect a new ad account
  const connectAccount = useCallback(async (account) => {
    const updatedAccounts = [...connectedAccounts, account];
    setConnectedAccounts(updatedAccounts);
    localStorage.setItem('meta_ad_accounts', JSON.stringify(updatedAccounts));
  }, [connectedAccounts]);

  // Disconnect an ad account
  const disconnectAccount = useCallback((accountId) => {
    const updatedAccounts = connectedAccounts.filter(a => a.id !== accountId);
    setConnectedAccounts(updatedAccounts);
    localStorage.setItem('meta_ad_accounts', JSON.stringify(updatedAccounts));
  }, [connectedAccounts]);

  // Demo login (for testing without real Meta credentials)
  const loginDemo = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate authentication
      const demoUser = {
        id: 'demo_user',
        name: 'Demo User',
        email: 'demo@example.com',
      };

      localStorage.setItem('meta_access_token', 'demo_token');
      localStorage.setItem('meta_token_expiry', (Date.now() + 86400000).toString());
      localStorage.setItem('meta_user_data', JSON.stringify(demoUser));

      setIsAuthenticated(true);
      setUser(demoUser);

      // Load demo accounts (the mock data)
      const { adAccounts } = await import('../data/mockData');
      setConnectedAccounts(adAccounts);
      localStorage.setItem('meta_ad_accounts', JSON.stringify(adAccounts));
    } catch (err) {
      console.error('Demo login error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    isAuthenticated,
    isLoading,
    user,
    connectedAccounts,
    error,
    loginWithRedirect,
    loginWithPopup,
    loginDemo,
    handleAuthCallback,
    logout,
    fetchAdAccounts,
    connectAccount,
    disconnectAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
