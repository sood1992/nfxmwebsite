import React, { useState } from 'react';
import { Anchor, Clock, Eye, Download } from 'lucide-react';
import {
  FilterBar,
  MetricPills,
  ViewToggle,
  CreativeCard,
  DataTable,
} from '../components/Shared';
import { useApp } from '../context/AppContext';
import './TopHooks.css';

const TopHooks = () => {
  const {
    getFilteredCreatives,
    selectedMetrics,
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
  } = useApp();

  const [viewMode, setViewMode] = useState('card');

  const creatives = getFilteredCreatives();

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const handleExport = () => {
    const exportData = creatives.map(c => ({
      Name: c.name,
      Type: c.type,
      Ads: c.adsCount,
      Spend: c.spend,
      'Hook Score': c.hookScore,
      Thumbstop: c.thumbstop,
      'First Frame Retention': c.firstFrameRetention,
    }));
    exportToCSV(exportData, 'top-hooks-report.csv');
  };

  const tableColumns = [
    {
      key: 'name',
      label: 'Creative',
      render: (value, row) => (
        <div className="creative-cell">
          <div className="creative-thumb">
            <img src={row.thumbnail} alt={value} />
          </div>
          <div className="creative-details">
            <span className="name">{value}</span>
            <span className="ads-count">{row.adsCount} ads</span>
          </div>
        </div>
      ),
    },
    { key: 'spend', label: 'Spend', format: 'currency', sortable: true, number: 1 },
    { key: 'hookScore', label: 'Hook Score', format: 'score', sortable: true, number: 2 },
    { key: 'thumbstop', label: 'Thumbstop', format: 'percentage', sortable: true, number: 3 },
    { key: 'firstFrameRetention', label: 'First Frame Retention', format: 'percentage', sortable: true, number: 4 },
  ];

  return (
    <div className="top-hooks-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <Anchor size={24} className="page-icon" />
          <div>
            <h1>Top Hooks</h1>
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
        This report shows which ads best stop scrolling and capture attention in the first 3 seconds.
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

      {/* Content */}
      {viewMode === 'card' && (
        <div className="creatives-grid">
          {creatives.map((creative) => (
            <CreativeCard
              key={creative.id}
              creative={creative}
              isSelected={selectedCreatives.includes(creative.id)}
              onSelect={toggleCreativeSelection}
              metrics={['spend', 'hookScore', 'thumbstop', 'firstFrameRetention']}
              currency={settings.currency}
            />
          ))}
        </div>
      )}

      {viewMode === 'table' && (
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
      )}

      {viewMode === 'chart' && (
        <div className="chart-view">
          <p className="chart-placeholder">Chart view coming soon...</p>
        </div>
      )}

      {creatives.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Anchor size={32} />
          </div>
          <h3 className="empty-state-title">No creatives found</h3>
          <p className="empty-state-description">
            Try adjusting your filters to see more results.
          </p>
        </div>
      )}
    </div>
  );
};

export default TopHooks;
