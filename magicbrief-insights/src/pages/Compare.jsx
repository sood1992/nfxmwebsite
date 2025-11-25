import React, { useState, useEffect } from 'react';
import { GitCompare, Plus, X, ArrowRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { useApp } from '../context/AppContext';
import './Compare.css';

const Compare = () => {
  const { settings, creativesData } = useApp();

  // Use creatives from context (alias for backward compatibility)
  const creatives = creativesData;

  const [selectedCreatives, setSelectedCreatives] = useState([]);
  const [showSelector, setShowSelector] = useState(false);
  const [selectorIndex, setSelectorIndex] = useState(null);

  // Initialize selectedCreatives when creatives data loads
  useEffect(() => {
    if (creatives?.length >= 2 && selectedCreatives.length === 0) {
      setSelectedCreatives([creatives[0], creatives[1]]);
    }
  }, [creatives]);

  const availableCreatives = creatives.filter(
    (c) => !selectedCreatives.find((s) => s?.id === c.id)
  );

  const handleAddCreative = (creative, index) => {
    const newSelected = [...selectedCreatives];
    newSelected[index] = creative;
    setSelectedCreatives(newSelected);
    setShowSelector(false);
    setSelectorIndex(null);
  };

  const handleRemoveCreative = (index) => {
    const newSelected = [...selectedCreatives];
    newSelected[index] = null;
    setSelectedCreatives(newSelected);
  };

  const comparisonMetrics = [
    { key: 'spend', label: 'Spend', format: 'currency' },
    { key: 'hookScore', label: 'Hook Score', format: 'number' },
    { key: 'holdScore', label: 'Hold Score', format: 'number' },
    { key: 'clickScore', label: 'Click Score', format: 'number' },
    { key: 'thumbstop', label: 'Thumbstop', format: 'percentage' },
    { key: 'firstFrameRetention', label: 'First Frame Retention', format: 'percentage' },
    { key: 'ctr', label: 'CTR', format: 'percentage' },
    { key: 'cpm', label: 'CPM', format: 'currency' },
    { key: 'cpc', label: 'CPC', format: 'currency' },
  ];

  const formatValue = (value, format) => {
    if (value === null || value === undefined) return '-';
    switch (format) {
      case 'currency':
        return `${settings.currency}${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'percentage':
        return `${value.toFixed(2)}%`;
      default:
        return value;
    }
  };

  // Prepare chart data
  const barChartData = comparisonMetrics.map((metric) => {
    const dataPoint = { name: metric.label };
    selectedCreatives.forEach((creative, index) => {
      if (creative) {
        dataPoint[`creative${index + 1}`] = creative[metric.key] || 0;
      }
    });
    return dataPoint;
  });

  // Prepare radar chart data
  const radarData = [
    { subject: 'Hook Score', fullMark: 100 },
    { subject: 'Hold Score', fullMark: 100 },
    { subject: 'Click Score', fullMark: 100 },
    { subject: 'Thumbstop', fullMark: 100 },
    { subject: 'Retention', fullMark: 100 },
  ].map((item) => {
    const dataPoint = { ...item };
    selectedCreatives.forEach((creative, index) => {
      if (creative) {
        if (item.subject === 'Hook Score') dataPoint[`creative${index + 1}`] = creative.hookScore || 0;
        else if (item.subject === 'Hold Score') dataPoint[`creative${index + 1}`] = creative.holdScore || 0;
        else if (item.subject === 'Click Score') dataPoint[`creative${index + 1}`] = creative.clickScore || 0;
        else if (item.subject === 'Thumbstop') dataPoint[`creative${index + 1}`] = creative.thumbstop || 0;
        else if (item.subject === 'Retention') dataPoint[`creative${index + 1}`] = creative.firstFrameRetention || 0;
      }
    });
    return dataPoint;
  });

  const colors = ['var(--primary-color)', 'var(--success-color)', 'var(--warning-color)'];

  return (
    <div className="compare-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <GitCompare size={24} className="page-icon" />
          <h1>Compare Creatives</h1>
        </div>
      </div>

      {/* Description */}
      <p className="page-description">
        Compare performance metrics across different creatives to identify what works best.
      </p>

      {/* Creative Selection */}
      <div className="compare-selector">
        {[0, 1, 2].map((index) => (
          <React.Fragment key={index}>
            <div className="compare-slot">
              {selectedCreatives[index] ? (
                <div className="selected-creative">
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveCreative(index)}
                  >
                    <X size={16} />
                  </button>
                  <img
                    src={selectedCreatives[index].thumbnail}
                    alt={selectedCreatives[index].name}
                  />
                  <div className="creative-info">
                    <span className="creative-name">
                      {selectedCreatives[index].name}
                    </span>
                    <span className="creative-type">
                      {selectedCreatives[index].type}
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  className="add-creative-btn"
                  onClick={() => {
                    setSelectorIndex(index);
                    setShowSelector(true);
                  }}
                >
                  <Plus size={24} />
                  <span>Add Creative</span>
                </button>
              )}
            </div>
            {index < 2 && <ArrowRight size={24} className="vs-icon" />}
          </React.Fragment>
        ))}
      </div>

      {/* Creative Selector Modal */}
      {showSelector && (
        <div className="selector-modal-overlay" onClick={() => setShowSelector(false)}>
          <div className="selector-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select Creative</h3>
              <button onClick={() => setShowSelector(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="creative-options">
              {availableCreatives.map((creative) => (
                <button
                  key={creative.id}
                  className="creative-option"
                  onClick={() => handleAddCreative(creative, selectorIndex)}
                >
                  <img src={creative.thumbnail} alt={creative.name} />
                  <div className="option-info">
                    <span className="option-name">{creative.name}</span>
                    <span className="option-type">{creative.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Charts */}
      {selectedCreatives.filter(Boolean).length >= 2 && (
        <div className="comparison-charts">
          {/* Radar Chart */}
          <div className="chart-card">
            <h3>Performance Radar</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                {selectedCreatives.map((creative, index) =>
                  creative ? (
                    <Radar
                      key={index}
                      name={creative.name}
                      dataKey={`creative${index + 1}`}
                      stroke={colors[index]}
                      fill={colors[index]}
                      fillOpacity={0.2}
                    />
                  ) : null
                )}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics Comparison Table */}
          <div className="comparison-table-card">
            <h3>Metrics Comparison</h3>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  {selectedCreatives.map((creative, index) =>
                    creative ? (
                      <th key={index}>{creative.name}</th>
                    ) : null
                  )}
                </tr>
              </thead>
              <tbody>
                {comparisonMetrics.map((metric) => {
                  const values = selectedCreatives
                    .filter(Boolean)
                    .map((c) => c[metric.key]);
                  const maxValue = Math.max(...values.filter((v) => v !== null && v !== undefined));

                  return (
                    <tr key={metric.key}>
                      <td className="metric-label">{metric.label}</td>
                      {selectedCreatives.map((creative, index) =>
                        creative ? (
                          <td
                            key={index}
                            className={
                              creative[metric.key] === maxValue
                                ? 'best-value'
                                : ''
                            }
                          >
                            {formatValue(creative[metric.key], metric.format)}
                          </td>
                        ) : null
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedCreatives.filter(Boolean).length < 2 && (
        <div className="empty-comparison">
          <GitCompare size={48} />
          <h3>Select at least 2 creatives to compare</h3>
          <p>Click the "Add Creative" buttons above to select creatives for comparison.</p>
        </div>
      )}
    </div>
  );
};

export default Compare;
