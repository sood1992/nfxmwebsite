import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { metaApi } from '../services/metaApi';
import {
  adAccounts as mockAdAccounts,
  creatives as mockCreatives,
  dateRanges,
  availableMetrics,
  adAccountSettings,
  performanceMetrics as mockPerformanceMetrics,
  recommendations as mockRecommendations,
  videoBreakdownData as mockVideoBreakdownData,
  scoreMetrics as mockScoreMetrics,
} from '../data/mockData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { isAuthenticated, connectedAccounts } = useAuth();

  // Use connected accounts from Auth context, fallback to mock
  const adAccounts = connectedAccounts?.length > 0 ? connectedAccounts : mockAdAccounts;

  // Account state
  const [selectedAccount, setSelectedAccount] = useState(adAccounts[0]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [dataError, setDataError] = useState(null);

  // Date range state
  const [dateRange, setDateRange] = useState('last14days');
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date(2025, 10, 11),
    end: new Date(2025, 10, 24),
  });

  // Filters state
  const [filters, setFilters] = useState({
    delivery: 'Active',
    creativeType: 'All',
    hookScoreMin: 0,
    status: 'All',
  });

  // Selected metrics state
  const [selectedMetrics, setSelectedMetrics] = useState(['spend', 'hookScore', 'thumbstop', 'firstFrameRetention']);

  // Data states
  const [creativesData, setCreativesData] = useState(mockCreatives);
  const [performanceMetrics, setPerformanceMetrics] = useState(mockPerformanceMetrics);
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [dailyData, setDailyData] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [adSets, setAdSets] = useState([]);
  const [videoBreakdownData, setVideoBreakdownData] = useState(mockVideoBreakdownData);

  // Calculate aggregate score metrics from creatives data
  const scoreMetrics = React.useMemo(() => {
    if (!creativesData || creativesData.length === 0) {
      return mockScoreMetrics;
    }

    const validHookScores = creativesData.filter(c => c.hookScore != null);
    const validHoldScores = creativesData.filter(c => c.holdScore != null);
    const validClickScores = creativesData.filter(c => c.clickScore != null);
    const validBuyScores = creativesData.filter(c => c.buyScore != null);

    return {
      hookScore: validHookScores.length > 0
        ? Math.round(validHookScores.reduce((sum, c) => sum + c.hookScore, 0) / validHookScores.length)
        : null,
      holdScore: validHoldScores.length > 0
        ? Math.round(validHoldScores.reduce((sum, c) => sum + c.holdScore, 0) / validHoldScores.length)
        : null,
      clickScore: validClickScores.length > 0
        ? Math.round(validClickScores.reduce((sum, c) => sum + c.clickScore, 0) / validClickScores.length)
        : null,
      buyScore: validBuyScores.length > 0
        ? Math.round(validBuyScores.reduce((sum, c) => sum + c.buyScore, 0) / validBuyScores.length)
        : null,
    };
  }, [creativesData]);

  // Selected creatives for comparison
  const [selectedCreatives, setSelectedCreatives] = useState([]);

  // Group by state
  const [groupBy, setGroupBy] = useState('adName');

  // View mode (card, table, chart)
  const [viewMode, setViewMode] = useState('card');

  // Sorting
  const [sortBy, setSortBy] = useState('spend');
  const [sortOrder, setSortOrder] = useState('desc');

  // Settings
  const [settings, setSettings] = useState(adAccountSettings);

  // Update selected account when connected accounts change
  useEffect(() => {
    if (connectedAccounts?.length > 0) {
      console.log('[AppContext] Connected accounts updated:', connectedAccounts);
      setSelectedAccount(connectedAccounts[0]);
    }
  }, [connectedAccounts]);

  // Get the account ID to use for API calls (handle both real and demo accounts)
  const getAccountIdForApi = useCallback((account) => {
    // Real Meta accounts have accountId in "act_xxxxx" format
    // Demo/mock accounts might only have id
    return account?.accountId || (account?.id ? `act_${account.id}` : null);
  }, []);

  // Check if this is a demo/mock account (not a real Meta account)
  const isDemoAccount = useCallback((account) => {
    // Demo accounts don't have accountId property or their id is a simple number
    return !account?.accountId || account?.id === 'demo_user';
  }, []);

  // Fetch data when account or date range changes
  useEffect(() => {
    const accountIdForApi = getAccountIdForApi(selectedAccount);
    console.log('[AppContext] Auth status check:', {
      isAuthenticated,
      selectedAccount,
      accountIdForApi,
      isDemoAccount: isDemoAccount(selectedAccount)
    });

    if (isAuthenticated && accountIdForApi && !isDemoAccount(selectedAccount)) {
      console.log('[AppContext] Triggering fetchAccountData for:', accountIdForApi);
      fetchAccountData();
    } else if (isDemoAccount(selectedAccount)) {
      console.log('[AppContext] Using demo/mock data - not fetching from API');
    }
  }, [isAuthenticated, selectedAccount, dateRange]);

  // Fetch all account data from Meta API
  const fetchAccountData = useCallback(async () => {
    const accountIdForApi = getAccountIdForApi(selectedAccount);
    if (!accountIdForApi) {
      console.log('[AppContext] No account ID available for API call');
      return;
    }

    setIsLoading(true);
    setDataError(null);

    console.log('[AppContext] Fetching data for account:', accountIdForApi, 'dateRange:', dateRange);

    try {
      const data = await metaApi.getAllAccountData(accountIdForApi, dateRange);
      console.log('[AppContext] API response:', data);

      if (data) {
        console.log('[AppContext] Processing API data:', {
          hasSummary: !!data.summary,
          dailyDataCount: data.dailyData?.length || 0,
          adInsightsCount: data.adInsights?.length || 0,
          campaignsCount: data.campaigns?.length || 0,
          adSetsCount: data.adSets?.length || 0,
          adsCount: data.ads?.length || 0,
        });

        // Update performance metrics
        if (data.summary) {
          console.log('[AppContext] Setting performance metrics from summary:', data.summary);
          setPerformanceMetrics({
            spend: {
              value: data.summary.spend,
              currency: selectedAccount.currency || '₹',
              chartData: data.dailyData?.map(d => ({ date: d.date, value: d.spend })) || [],
            },
            cpm: {
              value: data.summary.cpm,
              currency: selectedAccount.currency || '₹',
              chartData: data.dailyData?.map(d => ({ date: d.date, value: d.cpm })) || [],
            },
            cpc: {
              value: data.summary.cpc,
              currency: selectedAccount.currency || '₹',
              chartData: data.dailyData?.map(d => ({ date: d.date, value: d.cpc })) || [],
            },
            ctr: {
              value: data.summary.ctr,
              unit: '%',
              chartData: data.dailyData?.map(d => ({ date: d.date, value: d.ctr })) || [],
            },
          });
        } else {
          console.log('[AppContext] No summary data - keeping default metrics');
        }

        // Update daily data for charts
        if (data.dailyData?.length > 0) {
          setDailyData(data.dailyData);
        }

        // Create a map of insights by ad ID for quick lookup
        const insightsMap = new Map();
        if (data.adInsights?.length > 0) {
          data.adInsights.forEach(insight => {
            insightsMap.set(insight.adId, insight);
          });
        }

        // Merge ads with their insights (show all ads, even without insights for the period)
        if (data.ads?.length > 0) {
          console.log('[AppContext] Merging', data.ads.length, 'ads with', insightsMap.size, 'insights');
          const formattedCreatives = data.ads.map((ad, index) => {
            const insight = insightsMap.get(ad.id) || {};
            const hasInsights = !!insight.adId;

            return {
              id: ad.id || index + 1,
              name: ad.name || `Ad ${index + 1}`,
              thumbnail: ad.creative?.thumbnail_url || null,
              type: ad.creative?.asset_feed_spec ? 'Video' : 'Image',
              headline: ad.name,
              adsCount: 1,
              spend: insight.spend || 0,
              hookScore: insight.hookScore || null,
              thumbstop: insight.thumbstop || null,
              firstFrameRetention: insight.firstFrameRetention || null,
              holdScore: insight.holdScore || null,
              clickScore: insight.clickScore || null,
              buyScore: insight.buyScore || null,
              roas: insight.roas || null,
              purchases: insight.purchases || 0,
              aov: insight.aov || null,
              cpm: insight.cpm || 0,
              cpc: insight.cpc || 0,
              ctr: insight.ctr || 0,
              impressions: insight.impressions || 0,
              clicks: insight.clicks || 0,
              status: ad.effective_status || ad.status || 'Unknown',
              campaignName: insight.campaignName || '',
              adSetName: insight.adSetName || '',
              campaignId: ad.campaign_id,
              adSetId: ad.adset_id,
              hasInsights, // Flag to indicate if this ad has insights for the selected period
              createdTime: ad.created_time,
            };
          });
          setCreativesData(formattedCreatives);
          console.log('[AppContext] Set', formattedCreatives.length, 'creatives (', formattedCreatives.filter(c => c.hasInsights).length, 'with insights)');
        } else if (data.adInsights?.length > 0) {
          // Fallback: if no ads data but we have insights, use insights directly
          console.log('[AppContext] No ads data, using insights directly:', data.adInsights.length);
          const formattedCreatives = data.adInsights.map((insight, index) => ({
            id: insight.adId || index + 1,
            name: insight.adName || `Ad ${index + 1}`,
            thumbnail: null,
            type: 'Video',
            headline: insight.adName,
            adsCount: 1,
            spend: insight.spend,
            hookScore: insight.hookScore,
            thumbstop: insight.thumbstop,
            firstFrameRetention: insight.firstFrameRetention,
            holdScore: insight.holdScore,
            clickScore: insight.clickScore,
            buyScore: insight.buyScore,
            roas: insight.roas,
            purchases: insight.purchases,
            aov: insight.aov,
            cpm: insight.cpm,
            cpc: insight.cpc,
            ctr: insight.ctr,
            impressions: insight.impressions,
            clicks: insight.clicks,
            status: 'Active',
            campaignName: insight.campaignName,
            adSetName: insight.adSetName,
            hasInsights: true,
          }));
          setCreativesData(formattedCreatives);
        } else {
          console.log('[AppContext] No ads or insights returned - this account may have no ads');
          setCreativesData([]);
        }

        // Update campaigns and ad sets
        if (data.campaigns) setCampaigns(data.campaigns);
        if (data.adSets) setAdSets(data.adSets);

        // Generate recommendations based on data
        generateRecommendations(data);
      } else {
        console.log('[AppContext] No data returned from API');
        setCreativesData([]);
      }
    } catch (error) {
      console.error('[AppContext] Error fetching account data:', error);
      console.error('[AppContext] Error details:', {
        message: error.message,
        stack: error.stack,
        accountId: accountIdForApi,
      });
      setDataError(error.message);
      // Keep empty data on error for real accounts (don't show mock data)
      setCreativesData([]);
      setPerformanceMetrics({
        spend: { value: 0, currency: '₹', chartData: [] },
        cpm: { value: 0, currency: '₹', chartData: [] },
        cpc: { value: 0, currency: '₹', chartData: [] },
        ctr: { value: 0, unit: '%', chartData: [] },
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedAccount, dateRange]);

  // Generate AI-like recommendations based on data
  const generateRecommendations = useCallback((data) => {
    const newRecommendations = [];

    if (data.adInsights?.length > 0) {
      // Find best and worst performers
      const sorted = [...data.adInsights].sort((a, b) => (b.hookScore || 0) - (a.hookScore || 0));
      const topPerformer = sorted[0];
      const lowPerformer = sorted[sorted.length - 1];

      if (topPerformer?.hookScore > 80) {
        newRecommendations.push({
          id: 1,
          type: 'insight',
          title: 'Top Performer Identified',
          message: `"${topPerformer.adName}" has a hook score of ${topPerformer.hookScore}. Consider scaling this creative.`,
          priority: 'medium',
        });
      }

      if (lowPerformer?.hookScore < 50) {
        newRecommendations.push({
          id: 2,
          type: 'improvement',
          title: 'Hook Performance Alert',
          message: `"${lowPerformer.adName}" has a low hook score (${lowPerformer.hookScore}). Consider testing new opening frames.`,
          priority: 'high',
        });
      }

      // CTR analysis
      const avgCtr = data.adInsights.reduce((sum, i) => sum + (i.ctr || 0), 0) / data.adInsights.length;
      if (avgCtr < 1) {
        newRecommendations.push({
          id: 3,
          type: 'warning',
          title: 'Low CTR Detected',
          message: `Average CTR is ${avgCtr.toFixed(2)}%. Consider improving ad copy or creative elements.`,
          priority: 'high',
        });
      }
    }

    if (newRecommendations.length > 0) {
      setRecommendations(newRecommendations);
    } else {
      setRecommendations(mockRecommendations);
    }
  }, []);

  // Filter creatives based on current filters
  const getFilteredCreatives = useCallback(() => {
    let filtered = [...creativesData];

    if (filters.delivery !== 'All') {
      filtered = filtered.filter(c => c.status === filters.delivery);
    }

    if (filters.creativeType !== 'All') {
      filtered = filtered.filter(c => c.type === filters.creativeType);
    }

    if (filters.hookScoreMin > 0) {
      filtered = filtered.filter(c => (c.hookScore || 0) >= filters.hookScoreMin);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortBy] || 0;
      const bVal = b[sortBy] || 0;
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

    return filtered;
  }, [creativesData, filters, sortBy, sortOrder]);

  // Get creatives by type
  const getCreativesByType = useCallback((type) => {
    return creativesData.filter(c => c.type === type);
  }, [creativesData]);

  // Get top creatives by metric
  const getTopCreatives = useCallback((metric, limit = 10) => {
    return [...creativesData]
      .filter(c => c[metric] != null)
      .sort((a, b) => (b[metric] || 0) - (a[metric] || 0))
      .slice(0, limit);
  }, [creativesData]);

  // Add metric to selection
  const addMetric = useCallback((metricId) => {
    if (!selectedMetrics.includes(metricId)) {
      setSelectedMetrics(prev => [...prev, metricId]);
    }
  }, [selectedMetrics]);

  // Remove metric from selection
  const removeMetric = useCallback((metricId) => {
    setSelectedMetrics(prev => prev.filter(m => m !== metricId));
  }, []);

  // Reorder metrics
  const reorderMetrics = useCallback((newOrder) => {
    setSelectedMetrics(newOrder);
  }, []);

  // Toggle creative selection
  const toggleCreativeSelection = useCallback((creativeId) => {
    setSelectedCreatives(prev => {
      if (prev.includes(creativeId)) {
        return prev.filter(id => id !== creativeId);
      }
      return [...prev, creativeId];
    });
  }, []);

  // Select all creatives
  const selectAllCreatives = useCallback(() => {
    const filtered = getFilteredCreatives();
    setSelectedCreatives(filtered.map(c => c.id));
  }, [getFilteredCreatives]);

  // Clear creative selection
  const clearCreativeSelection = useCallback(() => {
    setSelectedCreatives([]);
  }, []);

  // Update filter
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Get date range label
  const getDateRangeLabel = useCallback(() => {
    const range = dateRanges.find(r => r.value === dateRange);
    if (range) {
      if (dateRange === 'last14days') {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 14);
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
      return range.label;
    }
    return 'Custom';
  }, [dateRange]);

  // Export data to CSV
  const exportToCSV = useCallback((data, filename = 'export.csv') => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => {
        const val = row[h];
        if (typeof val === 'string' && val.includes(',')) {
          return `"${val}"`;
        }
        return val ?? '';
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }, []);

  // Refresh data
  const refreshData = useCallback(() => {
    metaApi.clearCache();
    fetchAccountData();
  }, [fetchAccountData]);

  const value = {
    // Loading states
    isLoading,
    dataError,
    refreshData,

    // Account
    selectedAccount,
    setSelectedAccount,
    adAccounts,

    // Date range
    dateRange,
    setDateRange,
    customDateRange,
    setCustomDateRange,
    getDateRangeLabel,
    dateRanges,

    // Filters
    filters,
    updateFilter,
    setFilters,

    // Metrics
    selectedMetrics,
    addMetric,
    removeMetric,
    reorderMetrics,
    availableMetrics,
    performanceMetrics,

    // Creatives
    creativesData,
    setCreativesData,
    getFilteredCreatives,
    getCreativesByType,
    getTopCreatives,

    // Selection
    selectedCreatives,
    toggleCreativeSelection,
    selectAllCreatives,
    clearCreativeSelection,

    // View options
    groupBy,
    setGroupBy,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,

    // Additional data
    recommendations,
    dailyData,
    campaigns,
    adSets,
    scoreMetrics,
    videoBreakdownData,

    // Settings
    settings,
    setSettings,

    // Export
    exportToCSV,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
