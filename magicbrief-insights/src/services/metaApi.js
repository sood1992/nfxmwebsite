// Meta Marketing API Service
// Fetches real ad data from Meta (Facebook) Marketing API

import { metaAuth } from './metaAuth';

const API_VERSION = 'v18.0';
const GRAPH_API_URL = `https://graph.facebook.com/${API_VERSION}`;

class MetaApiService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
  }

  // Get authorization header
  getHeaders() {
    const token = metaAuth.getAccessToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Generic API request with caching
  async request(endpoint, params = {}, useCache = true) {
    const cacheKey = `${endpoint}_${JSON.stringify(params)}`;

    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        console.log('[MetaAPI] Returning cached data for:', endpoint);
        return cached.data;
      }
    }

    const token = metaAuth.getAccessToken();
    console.log('[MetaAPI] Making request:', endpoint, { hasToken: !!token, tokenPreview: token?.substring(0, 20) + '...' });

    if (!token) {
      throw new Error('Not authenticated');
    }

    // Check if this is a demo token
    if (token === 'demo_token') {
      console.log('[MetaAPI] Demo token detected - skipping API call');
      return null;
    }

    const queryParams = new URLSearchParams({
      access_token: token,
      ...params,
    });

    const url = `${GRAPH_API_URL}${endpoint}?${queryParams}`;
    console.log('[MetaAPI] Fetching URL:', url.replace(token, 'TOKEN_HIDDEN'));

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log('[MetaAPI] Response status:', response.status);
      console.log('[MetaAPI] Response data:', data);

      if (data.error) {
        console.error('[MetaAPI] API Error:', data.error);
        throw new Error(data.error.message);
      }

      if (useCache) {
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
      }

      return data;
    } catch (error) {
      console.error('[MetaAPI] Request Error:', error);
      throw error;
    }
  }

  // Get all ad accounts the user has access to
  async getAdAccounts() {
    try {
      const data = await this.request('/me/adaccounts', {
        fields: 'id,name,account_id,account_status,currency,timezone_name,business,amount_spent',
      });

      return data.data?.map(account => ({
        id: account.account_id,
        accountId: account.id, // act_xxxxx format
        name: account.name,
        status: this.getAccountStatus(account.account_status),
        currency: account.currency,
        timezone: account.timezone_name,
        business: account.business?.name || 'Personal',
        amountSpent: parseFloat(account.amount_spent) / 100,
        platform: 'Facebook',
        icon: '🔵',
      })) || [];
    } catch (error) {
      console.error('Error fetching ad accounts:', error);
      return [];
    }
  }

  // Get account status label
  getAccountStatus(statusCode) {
    const statuses = {
      1: 'Active',
      2: 'Disabled',
      3: 'Unsettled',
      7: 'Pending Review',
      8: 'Pending Closure',
      9: 'In Grace Period',
      100: 'Pending Risk Review',
      101: 'Pending Settlement',
      102: 'Needs Credit Card',
      201: 'Account Closed',
      202: 'Account Closed',
    };
    return statuses[statusCode] || 'Unknown';
  }

  // Get campaigns for an ad account
  async getCampaigns(accountId, dateRange) {
    const { since, until } = this.getDateRange(dateRange);

    try {
      const data = await this.request(`/${accountId}/campaigns`, {
        fields: 'id,name,status,objective,effective_status,created_time,updated_time',
        time_range: JSON.stringify({ since, until }),
        limit: 100,
      });

      return data.data || [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }

  // Get ad sets for an ad account
  async getAdSets(accountId, dateRange) {
    const { since, until } = this.getDateRange(dateRange);

    try {
      const data = await this.request(`/${accountId}/adsets`, {
        fields: 'id,name,status,campaign_id,effective_status,optimization_goal,billing_event,daily_budget,lifetime_budget',
        time_range: JSON.stringify({ since, until }),
        limit: 100,
      });

      return data.data || [];
    } catch (error) {
      console.error('Error fetching ad sets:', error);
      return [];
    }
  }

  // Get ads for an ad account
  async getAds(accountId, dateRange) {
    const { since, until } = this.getDateRange(dateRange);

    try {
      const data = await this.request(`/${accountId}/ads`, {
        fields: 'id,name,status,effective_status,creative{id,name,thumbnail_url,object_story_spec,asset_feed_spec},adset_id,campaign_id,created_time',
        time_range: JSON.stringify({ since, until }),
        limit: 100,
      });

      return data.data || [];
    } catch (error) {
      console.error('Error fetching ads:', error);
      return [];
    }
  }

  // Get ad insights (performance metrics)
  async getAdInsights(accountId, dateRange, breakdowns = []) {
    const { since, until } = this.getDateRange(dateRange);

    const fields = [
      'ad_id',
      'ad_name',
      'adset_id',
      'adset_name',
      'campaign_id',
      'campaign_name',
      'spend',
      'impressions',
      'clicks',
      'cpm',
      'cpc',
      'ctr',
      'reach',
      'frequency',
      'actions',
      'action_values',
      'cost_per_action_type',
      'video_avg_time_watched_actions',
      'video_p25_watched_actions',
      'video_p50_watched_actions',
      'video_p75_watched_actions',
      'video_p100_watched_actions',
      'video_play_actions',
    ].join(',');

    try {
      const params = {
        fields,
        time_range: JSON.stringify({ since, until }),
        level: 'ad',
        limit: 500,
      };

      if (breakdowns.length > 0) {
        params.breakdowns = breakdowns.join(',');
      }

      const data = await this.request(`/${accountId}/insights`, params);
      return this.processInsights(data.data || []);
    } catch (error) {
      console.error('Error fetching insights:', error);
      return [];
    }
  }

  // Get insights with daily breakdown for charts
  async getInsightsByDay(accountId, dateRange) {
    const { since, until } = this.getDateRange(dateRange);

    const fields = [
      'spend',
      'impressions',
      'clicks',
      'cpm',
      'cpc',
      'ctr',
      'reach',
      'actions',
    ].join(',');

    try {
      const data = await this.request(`/${accountId}/insights`, {
        fields,
        time_range: JSON.stringify({ since, until }),
        time_increment: 1, // Daily breakdown
        limit: 100,
      });

      return data.data?.map(day => ({
        date: day.date_start,
        spend: parseFloat(day.spend) || 0,
        impressions: parseInt(day.impressions) || 0,
        clicks: parseInt(day.clicks) || 0,
        cpm: parseFloat(day.cpm) || 0,
        cpc: parseFloat(day.cpc) || 0,
        ctr: parseFloat(day.ctr) || 0,
        reach: parseInt(day.reach) || 0,
      })) || [];
    } catch (error) {
      console.error('Error fetching daily insights:', error);
      return [];
    }
  }

  // Process insights data into usable format
  processInsights(insights) {
    return insights.map(insight => {
      const purchases = this.getActionValue(insight.actions, 'purchase');
      const purchaseValue = this.getActionValue(insight.action_values, 'purchase');
      const videoViews = this.getActionValue(insight.actions, 'video_view');

      // Calculate hook score based on video retention
      const p25 = this.getActionValue(insight.video_p25_watched_actions, 'video_view');
      const p50 = this.getActionValue(insight.video_p50_watched_actions, 'video_view');
      const p75 = this.getActionValue(insight.video_p75_watched_actions, 'video_view');
      const p100 = this.getActionValue(insight.video_p100_watched_actions, 'video_view');
      const totalPlays = this.getActionValue(insight.video_play_actions, 'video_view');

      // Calculate creative scores
      const hookScore = totalPlays > 0 ? Math.round((p25 / totalPlays) * 100) : null;
      const holdScore = p25 > 0 ? Math.round((p50 / p25) * 100) : null;
      const thumbstop = totalPlays > 0 ? (p25 / totalPlays) * 100 : null;
      const firstFrameRetention = totalPlays > 0 ? (p25 / totalPlays) * 100 : null;

      const spend = parseFloat(insight.spend) || 0;
      const impressions = parseInt(insight.impressions) || 0;
      const clicks = parseInt(insight.clicks) || 0;

      return {
        adId: insight.ad_id,
        adName: insight.ad_name,
        adSetId: insight.adset_id,
        adSetName: insight.adset_name,
        campaignId: insight.campaign_id,
        campaignName: insight.campaign_name,
        spend,
        impressions,
        clicks,
        cpm: parseFloat(insight.cpm) || 0,
        cpc: parseFloat(insight.cpc) || 0,
        ctr: parseFloat(insight.ctr) || 0,
        reach: parseInt(insight.reach) || 0,
        frequency: parseFloat(insight.frequency) || 0,
        purchases,
        purchaseValue,
        roas: spend > 0 ? purchaseValue / spend : null,
        aov: purchases > 0 ? purchaseValue / purchases : null,
        videoViews,
        hookScore,
        holdScore,
        thumbstop,
        firstFrameRetention,
        clickScore: clicks > 0 ? Math.round((clicks / impressions) * 1000) : null,
        buyScore: purchases > 0 && clicks > 0 ? Math.round((purchases / clicks) * 100) : null,
      };
    });
  }

  // Get action value from actions array
  getActionValue(actions, actionType) {
    if (!actions) return 0;
    const action = actions.find(a => a.action_type === actionType);
    return action ? parseFloat(action.value) : 0;
  }

  // Get creatives with thumbnails and media info
  async getCreatives(accountId) {
    try {
      const data = await this.request(`/${accountId}/adcreatives`, {
        fields: 'id,name,thumbnail_url,object_story_spec,title,body,effective_object_story_id,status',
        limit: 100,
      });

      return data.data?.map(creative => ({
        id: creative.id,
        name: creative.name || 'Untitled Creative',
        thumbnail: creative.thumbnail_url,
        title: creative.title || creative.object_story_spec?.link_data?.name,
        body: creative.body || creative.object_story_spec?.link_data?.message,
        status: creative.status,
      })) || [];
    } catch (error) {
      console.error('Error fetching creatives:', error);
      return [];
    }
  }

  // Get video thumbnails and frame data
  async getVideoThumbnails(videoId) {
    try {
      const data = await this.request(`/${videoId}/thumbnails`, {
        fields: 'uri,is_preferred,height,width',
      });
      return data.data || [];
    } catch (error) {
      console.error('Error fetching video thumbnails:', error);
      return [];
    }
  }

  // Get ad account summary metrics
  async getAccountSummary(accountId, dateRange) {
    const { since, until } = this.getDateRange(dateRange);

    try {
      const data = await this.request(`/${accountId}/insights`, {
        fields: 'spend,impressions,clicks,cpm,cpc,ctr,reach,frequency,actions,action_values',
        time_range: JSON.stringify({ since, until }),
      });

      if (data.data && data.data.length > 0) {
        const summary = data.data[0];
        const purchases = this.getActionValue(summary.actions, 'purchase');
        const purchaseValue = this.getActionValue(summary.action_values, 'purchase');

        return {
          spend: parseFloat(summary.spend) || 0,
          impressions: parseInt(summary.impressions) || 0,
          clicks: parseInt(summary.clicks) || 0,
          cpm: parseFloat(summary.cpm) || 0,
          cpc: parseFloat(summary.cpc) || 0,
          ctr: parseFloat(summary.ctr) || 0,
          reach: parseInt(summary.reach) || 0,
          frequency: parseFloat(summary.frequency) || 0,
          purchases,
          purchaseValue,
          roas: parseFloat(summary.spend) > 0 ? purchaseValue / parseFloat(summary.spend) : 0,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching account summary:', error);
      return null;
    }
  }

  // Get date range based on preset
  getDateRange(preset) {
    const today = new Date();
    let since, until;

    switch (preset) {
      case 'today':
        since = this.formatDate(today);
        until = this.formatDate(today);
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        since = this.formatDate(yesterday);
        until = this.formatDate(yesterday);
        break;
      case 'last7days':
        const week = new Date(today);
        week.setDate(week.getDate() - 7);
        since = this.formatDate(week);
        until = this.formatDate(today);
        break;
      case 'last14days':
        const twoWeeks = new Date(today);
        twoWeeks.setDate(twoWeeks.getDate() - 14);
        since = this.formatDate(twoWeeks);
        until = this.formatDate(today);
        break;
      case 'last30days':
        const month = new Date(today);
        month.setDate(month.getDate() - 30);
        since = this.formatDate(month);
        until = this.formatDate(today);
        break;
      case 'thisMonth':
        since = this.formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
        until = this.formatDate(today);
        break;
      case 'lastMonth':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        since = this.formatDate(lastMonth);
        until = this.formatDate(lastMonthEnd);
        break;
      default:
        const defaultDate = new Date(today);
        defaultDate.setDate(defaultDate.getDate() - 14);
        since = this.formatDate(defaultDate);
        until = this.formatDate(today);
    }

    return { since, until };
  }

  // Format date for API
  formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get all data for an account (comprehensive fetch)
  async getAllAccountData(accountId, dateRange) {
    try {
      const [summary, dailyData, adInsights, campaigns, adSets] = await Promise.all([
        this.getAccountSummary(accountId, dateRange),
        this.getInsightsByDay(accountId, dateRange),
        this.getAdInsights(accountId, dateRange),
        this.getCampaigns(accountId, dateRange),
        this.getAdSets(accountId, dateRange),
      ]);

      return {
        summary,
        dailyData,
        adInsights,
        campaigns,
        adSets,
      };
    } catch (error) {
      console.error('Error fetching all account data:', error);
      return null;
    }
  }
}

export const metaApi = new MetaApiService();
export default metaApi;
