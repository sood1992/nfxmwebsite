import React from 'react';
import { Play, Check } from 'lucide-react';
import './CreativeCard.css';

const CreativeCard = ({
  creative,
  isSelected = false,
  onSelect,
  metrics = ['spend', 'hookScore'],
  currency = '₹',
}) => {
  const formatValue = (key, value) => {
    if (value === null || value === undefined) return '-';

    switch (key) {
      case 'spend':
        return `${currency}${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'hookScore':
      case 'holdScore':
      case 'clickScore':
      case 'buyScore':
        return value;
      case 'thumbstop':
      case 'firstFrameRetention':
      case 'ctr':
        return `${value.toFixed(2)}%`;
      case 'cpm':
      case 'cpc':
        return `${currency}${value.toFixed(2)}`;
      case 'impressions':
      case 'clicks':
        return value.toLocaleString('en-IN');
      default:
        return value;
    }
  };

  const getMetricLabel = (key) => {
    const labels = {
      spend: 'Spend',
      hookScore: 'Hook Score',
      holdScore: 'Hold Score',
      clickScore: 'Click Score',
      buyScore: 'Buy Score',
      thumbstop: 'Thumbstop',
      firstFrameRetention: 'First Frame Retention',
      ctr: 'CTR',
      cpm: 'CPM',
      cpc: 'CPC',
      impressions: 'Impressions',
      clicks: 'Clicks',
      roas: 'ROAS',
      purchases: 'Purchases',
      aov: 'AOV',
    };
    return labels[key] || key;
  };

  const getScoreClass = (score) => {
    if (score === null || score === undefined) return '';
    if (score >= 80) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'average';
    return 'poor';
  };

  const isScoreMetric = (key) => {
    return ['hookScore', 'holdScore', 'clickScore', 'buyScore'].includes(key);
  };

  return (
    <div
      className={`creative-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(creative.id)}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <div className={`creative-checkbox ${isSelected ? 'checked' : ''}`}>
          {isSelected && <Check size={14} />}
        </div>
      )}

      {/* Thumbnail */}
      <div className="creative-thumbnail">
        <img src={creative.thumbnail} alt={creative.name} loading="lazy" />
        {creative.type === 'Video' && (
          <div className="creative-play-button">
            <Play size={20} fill="white" />
          </div>
        )}
        <span className="creative-type-badge">{creative.type}</span>
        {creative.headline && (
          <div className="creative-headline">{creative.headline}</div>
        )}
      </div>

      {/* Info */}
      <div className="creative-info">
        <h3 className="creative-name">{creative.name}</h3>
        <span className="creative-ads-count">{creative.adsCount} ads</span>

        {/* Metrics */}
        <div className="creative-metrics">
          {metrics.map((metricKey) => (
            <div key={metricKey} className="creative-metric">
              <span className="creative-metric-label">
                {getMetricLabel(metricKey)}
              </span>
              {isScoreMetric(metricKey) ? (
                <div className="score-bar">
                  <div className="score-bar-track">
                    <div
                      className={`score-bar-fill ${getScoreClass(creative[metricKey])}`}
                      style={{ width: `${Math.min(creative[metricKey] || 0, 100)}%` }}
                    />
                  </div>
                  <span className={`score-value ${getScoreClass(creative[metricKey])}`}>
                    {formatValue(metricKey, creative[metricKey])}
                  </span>
                </div>
              ) : (
                <span className="creative-metric-value">
                  {formatValue(metricKey, creative[metricKey])}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreativeCard;
