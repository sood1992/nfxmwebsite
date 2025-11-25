import React, { useState } from 'react';
import { Calendar, Filter, Users, X, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './FilterBar.css';

const FilterBar = ({ showGroupBy = true }) => {
  const {
    dateRange,
    setDateRange,
    getDateRangeLabel,
    dateRanges,
    filters,
    updateFilter,
    groupBy,
    setGroupBy,
  } = useApp();

  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [showGroupByDropdown, setShowGroupByDropdown] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(3);

  const groupByOptions = [
    { value: 'adName', label: 'Ad Name' },
    { value: 'adSet', label: 'Ad Set' },
    { value: 'campaign', label: 'Campaign' },
    { value: 'creative', label: 'Creative' },
  ];

  const filterOptions = {
    delivery: ['All', 'Active', 'Paused', 'Archived', 'Deleted', 'Pending'],
    creativeType: ['All', 'Video', 'Image', 'Carousel'],
    hookScoreMin: [0, 50, 60, 70, 80, 90],
  };

  return (
    <div className="filter-bar">
      {/* Date Range */}
      <div className="filter-dropdown">
        <button
          className="filter-btn"
          onClick={() => setShowDateDropdown(!showDateDropdown)}
        >
          <Calendar size={16} />
          <span>{getDateRangeLabel()}</span>
          <ChevronDown size={16} />
        </button>
        {showDateDropdown && (
          <div className="dropdown-menu">
            {dateRanges.map((range) => (
              <button
                key={range.value}
                className={`dropdown-item ${dateRange === range.value ? 'active' : ''}`}
                onClick={() => {
                  setDateRange(range.value);
                  setShowDateDropdown(false);
                }}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="filter-dropdown">
        <button
          className="filter-btn has-count"
          onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
        >
          <Filter size={16} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="filter-count">{activeFiltersCount}</span>
          )}
          <ChevronDown size={16} />
        </button>
        {showFiltersDropdown && (
          <div className="dropdown-menu filters-menu">
            <div className="filter-section">
              <label className="filter-label">Delivery Status</label>
              <div className="filter-options">
                {filterOptions.delivery.map((option) => (
                  <button
                    key={option}
                    className={`filter-option ${filters.delivery === option ? 'active' : ''}`}
                    onClick={() => updateFilter('delivery', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <label className="filter-label">Creative Type</label>
              <div className="filter-options">
                {filterOptions.creativeType.map((option) => (
                  <button
                    key={option}
                    className={`filter-option ${filters.creativeType === option ? 'active' : ''}`}
                    onClick={() => updateFilter('creativeType', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <label className="filter-label">Minimum Hook Score</label>
              <div className="filter-options">
                {filterOptions.hookScoreMin.map((option) => (
                  <button
                    key={option}
                    className={`filter-option ${filters.hookScoreMin === option ? 'active' : ''}`}
                    onClick={() => updateFilter('hookScoreMin', option)}
                  >
                    {option === 0 ? 'Any' : `> ${option}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-actions">
              <button
                className="filter-clear"
                onClick={() => {
                  updateFilter('delivery', 'All');
                  updateFilter('creativeType', 'All');
                  updateFilter('hookScoreMin', 0);
                }}
              >
                Clear all
              </button>
              <button
                className="filter-apply"
                onClick={() => setShowFiltersDropdown(false)}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Group By */}
      {showGroupBy && (
        <div className="filter-dropdown">
          <button
            className="filter-btn"
            onClick={() => setShowGroupByDropdown(!showGroupByDropdown)}
          >
            <Users size={16} />
            <span>Group by {groupByOptions.find(o => o.value === groupBy)?.label}</span>
            <ChevronDown size={16} />
          </button>
          {showGroupByDropdown && (
            <div className="dropdown-menu">
              {groupByOptions.map((option) => (
                <button
                  key={option.value}
                  className={`dropdown-item ${groupBy === option.value ? 'active' : ''}`}
                  onClick={() => {
                    setGroupBy(option.value);
                    setShowGroupByDropdown(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Filters Tags */}
      <div className="active-filters">
        {filters.delivery !== 'All' && (
          <span className="filter-tag">
            Delivery includes <strong>{filters.delivery}</strong>
            <button onClick={() => updateFilter('delivery', 'All')}>
              <X size={14} />
            </button>
          </span>
        )}
        {filters.creativeType !== 'All' && (
          <span className="filter-tag">
            Creative Type includes <strong>{filters.creativeType}</strong>
            <button onClick={() => updateFilter('creativeType', 'All')}>
              <X size={14} />
            </button>
          </span>
        )}
        {filters.hookScoreMin > 0 && (
          <span className="filter-tag">
            Hook Score &gt; <strong>{filters.hookScoreMin}</strong>
            <button onClick={() => updateFilter('hookScoreMin', 0)}>
              <X size={14} />
            </button>
          </span>
        )}
      </div>

      {/* Excluded count */}
      <span className="excluded-count">
        56 ads excluded by filters
      </span>
    </div>
  );
};

export default FilterBar;
