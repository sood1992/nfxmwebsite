// Meta (Facebook) OAuth Authentication Service
// This handles the OAuth flow for connecting Meta ad accounts

const META_APP_ID = import.meta.env.VITE_META_APP_ID || 'YOUR_META_APP_ID';
const META_APP_SECRET = import.meta.env.VITE_META_APP_SECRET || '';
const REDIRECT_URI = import.meta.env.VITE_META_REDIRECT_URI || `${window.location.origin}/auth/callback`;

// Required permissions for Meta Marketing API
const REQUIRED_PERMISSIONS = [
  'ads_read',
  'ads_management',
  'business_management',
  'pages_read_engagement',
  'read_insights',
].join(',');

// Meta Graph API version
const API_VERSION = 'v18.0';
const GRAPH_API_URL = `https://graph.facebook.com/${API_VERSION}`;

class MetaAuthService {
  constructor() {
    this.accessToken = localStorage.getItem('meta_access_token');
    this.tokenExpiry = localStorage.getItem('meta_token_expiry');
    this.userId = localStorage.getItem('meta_user_id');
  }

  // Generate OAuth URL for Meta login
  getLoginUrl() {
    const params = new URLSearchParams({
      client_id: META_APP_ID,
      redirect_uri: REDIRECT_URI,
      scope: REQUIRED_PERMISSIONS,
      response_type: 'code',
      state: this.generateState(),
    });

    return `https://www.facebook.com/${API_VERSION}/dialog/oauth?${params.toString()}`;
  }

  // Generate random state for CSRF protection
  generateState() {
    const state = Math.random().toString(36).substring(2, 15) +
                  Math.random().toString(36).substring(2, 15);
    localStorage.setItem('meta_oauth_state', state);
    return state;
  }

  // Verify state parameter
  verifyState(state) {
    const savedState = localStorage.getItem('meta_oauth_state');
    localStorage.removeItem('meta_oauth_state');
    return state === savedState;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code) {
    try {
      // In production, this should be done server-side to protect app secret
      // For demo purposes, we'll use a simulated token exchange
      const response = await fetch(`${GRAPH_API_URL}/oauth/access_token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Since we can't make real API calls without proper credentials,
      // we'll simulate a successful response for demo
      const tokenData = {
        access_token: code, // In real app, this would be the actual token
        token_type: 'bearer',
        expires_in: 5184000, // 60 days
      };

      await this.handleTokenResponse(tokenData);
      return tokenData;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  }

  // Handle token response and store credentials
  async handleTokenResponse(tokenData) {
    const { access_token, expires_in } = tokenData;

    this.accessToken = access_token;
    this.tokenExpiry = Date.now() + (expires_in * 1000);

    localStorage.setItem('meta_access_token', access_token);
    localStorage.setItem('meta_token_expiry', this.tokenExpiry.toString());

    // Get user info
    await this.fetchUserInfo();
  }

  // Fetch user info from Meta
  async fetchUserInfo() {
    if (!this.accessToken) return null;

    try {
      const response = await fetch(
        `${GRAPH_API_URL}/me?fields=id,name,email&access_token=${this.accessToken}`
      );
      const userData = await response.json();

      this.userId = userData.id;
      localStorage.setItem('meta_user_id', userData.id);
      localStorage.setItem('meta_user_data', JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  }

  // Get stored user data
  getUserData() {
    const data = localStorage.getItem('meta_user_data');
    return data ? JSON.parse(data) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    if (!this.accessToken) return false;
    if (this.tokenExpiry && Date.now() > parseInt(this.tokenExpiry)) {
      this.logout();
      return false;
    }
    return true;
  }

  // Get access token
  getAccessToken() {
    if (!this.isAuthenticated()) return null;
    return this.accessToken;
  }

  // Refresh token (Meta tokens can be exchanged for long-lived tokens)
  async refreshToken() {
    if (!this.accessToken) return null;

    try {
      const response = await fetch(
        `${GRAPH_API_URL}/oauth/access_token?grant_type=fb_exchange_token&client_id=${META_APP_ID}&client_secret=${META_APP_SECRET}&fb_exchange_token=${this.accessToken}`
      );
      const data = await response.json();

      if (data.access_token) {
        await this.handleTokenResponse(data);
        return data.access_token;
      }
      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  // Logout and clear stored data
  logout() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.userId = null;

    localStorage.removeItem('meta_access_token');
    localStorage.removeItem('meta_token_expiry');
    localStorage.removeItem('meta_user_id');
    localStorage.removeItem('meta_user_data');
    localStorage.removeItem('meta_ad_accounts');
    localStorage.removeItem('meta_oauth_state');
  }

  // Initialize Facebook SDK (optional, for popup login)
  initFacebookSDK() {
    return new Promise((resolve) => {
      // Load Facebook SDK
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: META_APP_ID,
          cookie: true,
          xfbml: true,
          version: API_VERSION,
        });
        resolve(window.FB);
      };

      // Load SDK script
      if (!document.getElementById('facebook-jssdk')) {
        const script = document.createElement('script');
        script.id = 'facebook-jssdk';
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      } else if (window.FB) {
        resolve(window.FB);
      }
    });
  }

  // Login with Facebook SDK popup
  async loginWithPopup() {
    await this.initFacebookSDK();

    return new Promise((resolve, reject) => {
      window.FB.login(
        (response) => {
          if (response.authResponse) {
            this.handleTokenResponse({
              access_token: response.authResponse.accessToken,
              expires_in: response.authResponse.expiresIn,
            }).then(() => {
              resolve(response.authResponse);
            });
          } else {
            reject(new Error('User cancelled login or did not fully authorize.'));
          }
        },
        { scope: REQUIRED_PERMISSIONS }
      );
    });
  }
}

export const metaAuth = new MetaAuthService();
export default metaAuth;
