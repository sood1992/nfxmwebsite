import React, { createContext, useContext, useState, useCallback } from 'react';
import { adAccounts, creatives, dateRanges, availableMetrics, adAccountSettings } from '../data/mockData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Account state
  const [selectedAccount, setSelectedAccount] = useState(adAccounts[0]);

  // Date range state
  const [dateRange, setDateRange] = useState('last14days');
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date(2025, 10, 11),
    end: new Date(2025, 10, 24),
  });

  // Filters state
  const [filters, setFilters] = useState({
    delivery: 'Active',
    creativeType: 'Video',
    hookScoreMin: 70,
    status: 'All',
  });

  // Selected metrics state
  const [selectedMetrics, setSelectedMetrics] = useState(['spend', 'hookScore', 'thumbstop', 'firstFrameRetention']);

  // Creatives state with filtering
  const [creativesData, setCreativesData] = useState(creatives);

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

  // Filter creatives based on current filters
  const getFilteredCreatives = useCallback(() => {
    let filtered = [...creativesData];

    if (filters.delivery !== 'All') {
      filtered = filtered.filter(c => c.status === filters.delivery);
    }

    if (filters.creativeType !== 'All') {
      filtered = filtered.filter(c => c.type === filters.creativeType);
    }

    if (filters.hookScoreMin) {
      filtered = filtered.filter(c => c.hookScore >= filters.hookScoreMin);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortBy] || 0;
      const bVal = b[sortBy] || 0;
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

    return filtered;
  }, [creativesData, filters, sortBy, sortOrder]);

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
        return 'Nov 11, 2025 - Nov 24, 2025';
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

  const value = {
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

    // Creatives
    creativesData,
    setCreativesData,
    getFilteredCreatives,

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
