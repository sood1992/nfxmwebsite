import React, { useState } from 'react';
import {
  Trophy,
  Clock,
  Download,
  ChevronDown,
  Eye,
  AlertCircle,
  Loader,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  FilterBar,
  MetricPills,
  ViewToggle,
  DataTable,
} from '../components/Shared';
import { useApp } from '../context/AppContext';
import './TopCreatives.css';

const TopCreatives = () => {
  const {
    getFilteredCreatives,
    selectedCreatives,
    toggleCreativeSelection,
    selectAllCreatives,
    clearCreativeSelection,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    exportToCSV,
    settings,
    isLoading,
    creativesData,
    getDateRangeLabel,
  } = useApp();

  const [viewMode, setViewMode] = useState('chart');
  const [tableFormat, setTableFormat] = useState('Custom');

  const creatives = getFilteredCreatives();

  // Prepare chart data
  const chartData = creatives
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 10)
    .map((c) => ({
      name: c.name,
      spend: c.spend,
      thumbnail: c.thumbnail,
      id: c.id,
    }));

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const handleExport = () => {
    const exportData = creatives.map((c) => ({
      Name: c.name,
      Type: c.type,
      Ads: c.adsCount,
      Spend: c.spend,
      ROAS: c.roas || '-',
      'Purchases (All)': c.purchases || '-',
      AOV: c.aov || '-',
    }));
    exportToCSV(exportData, 'top-creatives-report.csv');
  };

  const tableColumns = [
    {
      key: 'name',
      label: 'Creative',
      render: (value, row) => (
        <div className="creative-cell">
          <div className="creative-thumb">
            {row.thumbnail ? (
              <img src={row.thumbnail} alt={value} />
            ) : (
              <div className="thumb-placeholder-small">
                {row.type === 'Video' ? '🎬' : '🖼️'}
              </div>
            )}
          </div>
          <div className="creative-details">
            <span className="name">{value}</span>
            <span className="ads-count">{row.adsCount} ads • {row.status}</span>
          </div>
        </div>
      ),
    },
    { key: 'spend', label: 'Spend', format: 'currency', sortable: true, number: 1 },
    { key: 'roas', label: 'ROAS', sortable: true, number: 2 },
    { key: 'purchases', label: 'Purchases (All)', sortable: true },
    { key: 'aov', label: 'AOV', format: 'currency', sortable: true },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <div className="tooltip-header">
            <img src={data.thumbnail} alt={data.name} className="tooltip-thumb" />
            <span className="tooltip-name">{data.name}</span>
          </div>
          <div className="tooltip-value">
            {settings.currency}
            {data.spend.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value) => {
    if (value >= 100000) {
      return `${settings.currency}${(value / 100000).toFixed(1)}L`;
    }
    if (value >= 1000) {
      return `${settings.currency}${(value / 1000).toFixed(1)}K`;
    }
    return `${settings.currency}${value}`;
  };

  return (
    <div className="top-creatives-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <Trophy size={24} className="page-icon" />
          <div>
            <h1>Top Creatives</h1>
            <p className="last-synced">
              <Clock size={14} />
              Last synced 2 hours ago
            </p>
          </div>
        </div>
        <button className="export-btn" onClick={handleExport}>
          <Download size={16} />
          Download CSV
        </button>
      </div>

      {/* Description */}
      <p className="page-description">
        This report shows your best performing creative assets ranked by spend and performance
        metrics.
      </p>

      {/* Filter Bar */}
      <FilterBar />

      {/* Metric Pills and View Toggle */}
      <div className="controls-bar">
        <MetricPills />
        <div className="view-controls">
          <button className="metrics-modal-btn">
            <Eye size={16} />
            Metrics
          </button>
          <ViewToggle
            view={viewMode}
            onChange={setViewMode}
            options={['card', 'chart', 'table']}
          />
        </div>
      </div>

      {/* Chart View */}
      {viewMode === 'chart' && (
        <div className="chart-section">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="spend" radius={[4, 4, 0, 0]} maxBarSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? 'var(--primary-color)' : 'var(--primary-light)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Creative Thumbnails */}
          <div className="chart-thumbnails">
            {chartData.map((creative) => (
              <div key={creative.id} className="chart-thumb-item">
                <span className="thumb-spend">
                  {settings.currency}
                  {(creative.spend || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                {creative.thumbnail ? (
                  <img src={creative.thumbnail} alt={creative.name} className="thumb-img" />
                ) : (
                  <div className="thumb-img thumb-placeholder">📊</div>
                )}
                <span className="thumb-name">{creative.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="table-section">
          <div className="table-header">
            <div className="table-options">
              <button className="table-option-btn">
                Custom
                <ChevronDown size={16} />
              </button>
              <button className="table-option-btn">
                Table Format
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Selection Bar */}
          {selectedCreatives.length > 0 && (
            <div className="selection-bar">
              <span>{selectedCreatives.length} ads selected</span>
              <div className="selection-actions">
                <button onClick={selectAllCreatives}>Select All</button>
                <button onClick={clearCreativeSelection}>Clear</button>
              </div>
            </div>
          )}

          <DataTable
            data={creatives}
            columns={tableColumns}
            selectedRows={selectedCreatives}
            onSelectRow={toggleCreativeSelection}
            onSelectAll={() => {
              if (selectedCreatives.length === creatives.length) {
                clearCreativeSelection();
              } else {
                selectAllCreatives();
              }
            }}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            currency={settings.currency}
          />
        </div>
      )}

      {/* Card View */}
      {viewMode === 'card' && creatives.length > 0 && (
        <div className="creatives-grid">
          {creatives.map((creative) => (
            <div
              key={creative.id}
              className={`creative-card ${
                selectedCreatives.includes(creative.id) ? 'selected' : ''
              }`}
              onClick={() => toggleCreativeSelection(creative.id)}
            >
              <div className="creative-thumbnail">
                {creative.thumbnail ? (
                  <img src={creative.thumbnail} alt={creative.name} />
                ) : (
                  <div className="thumbnail-placeholder">
                    <span>{creative.type === 'Video' ? '🎬' : '🖼️'}</span>
                  </div>
                )}
                <span className="creative-type-badge">{creative.type}</span>
                <span className={`status-badge status-${creative.status?.toLowerCase()}`}>
                  {creative.status}
                </span>
              </div>
              <div className="creative-info">
                <h3>{creative.name}</h3>
                <span className="ads-count">{creative.adsCount} ads</span>
                <div className="creative-metrics">
                  <div className="metric-row">
                    <span>Spend</span>
                    <span className="metric-value">
                      {settings.currency}
                      {(creative.spend || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="metric-row">
                    <span>ROAS</span>
                    <span className="metric-value">
                      {creative.roas ? creative.roas.toFixed(2) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Loader size={32} className="spin" />
          </div>
          <h3 className="empty-state-title">Loading ad data...</h3>
          <p className="empty-state-description">
            Fetching your creative performance data from Meta.
          </p>
        </div>
      )}

      {/* No Data State */}
      {!isLoading && creatives.length === 0 && creativesData.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <AlertCircle size={32} />
          </div>
          <h3 className="empty-state-title">No ad data found</h3>
          <p className="empty-state-description">
            No ads found for the selected date range ({getDateRangeLabel()}).
            <br />
            Try selecting a different date range or check if your account has active ads.
          </p>
        </div>
      )}

      {/* Filtered Empty State */}
      {!isLoading && creatives.length === 0 && creativesData.length > 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Trophy size={32} />
          </div>
          <h3 className="empty-state-title">No creatives match filters</h3>
          <p className="empty-state-description">
            Try adjusting your filters to see more results.
          </p>
        </div>
      )}
    </div>
  );
};

export default TopCreatives;
