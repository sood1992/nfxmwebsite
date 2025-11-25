import React, { useState } from 'react';
import { Plane, Clock, Download, Eye, AlertCircle, Loader } from 'lucide-react';
import {
  FilterBar,
  MetricPills,
  ViewToggle,
  CreativeCard,
  DataTable,
} from '../components/Shared';
import { useApp } from '../context/AppContext';
import './CheckLandingPage.css';

const CheckLandingPage = () => {
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
    const exportData = creatives.map((c) => ({
      Name: c.name,
      Type: c.type,
      Ads: c.adsCount,
      Spend: c.spend,
      'Click Score': c.clickScore,
      'Buy Score': c.buyScore || '-',
    }));
    exportToCSV(exportData, 'landing-page-report.csv');
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
    { key: 'clickScore', label: 'Click Score', format: 'score', sortable: true, number: 2 },
    { key: 'buyScore', label: 'Buy Score', format: 'score', sortable: true, number: 3 },
  ];

  return (
    <div className="check-landing-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <Plane size={24} className="page-icon" />
          <div>
            <h1>Check Landing Page</h1>
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
        Analyze landing page performance and conversion rates. Compare Click Score and Buy Score to
        identify opportunities for landing page optimization.
      </p>

      {/* Filter Bar */}
      <FilterBar />

      {/* Controls Bar */}
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
            options={['card', 'table']}
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

      {/* Card View */}
      {viewMode === 'card' && (
        <div className="creatives-grid">
          {creatives.map((creative) => (
            <CreativeCard
              key={creative.id}
              creative={creative}
              isSelected={selectedCreatives.includes(creative.id)}
              onSelect={toggleCreativeSelection}
              metrics={['spend', 'clickScore', 'buyScore']}
              currency={settings.currency}
            />
          ))}
        </div>
      )}

      {/* Table View */}
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

      {!isLoading && creatives.length === 0 && creativesData.length > 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Plane size={32} />
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

export default CheckLandingPage;
