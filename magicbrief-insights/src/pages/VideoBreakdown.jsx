import React, { useState, useEffect } from 'react';
import { Video, Clock, Play, Pause, SkipBack, SkipForward, AlertCircle, Loader } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { FilterBar } from '../components/Shared';
import { useApp } from '../context/AppContext';
import './VideoBreakdown.css';

const VideoBreakdown = () => {
  const { settings, creativesData, videoBreakdownData, isLoading, getDateRangeLabel } = useApp();

  // Use creatives from context (alias for backward compatibility)
  const creatives = creativesData;

  const [selectedCreative, setSelectedCreative] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSecond, setCurrentSecond] = useState(0);

  const videoCreatives = creatives.filter((c) => c.type === 'Video');

  // Initialize selectedCreative when creatives data loads
  useEffect(() => {
    if (videoCreatives?.length > 0 && !selectedCreative) {
      setSelectedCreative(videoCreatives[0]);
    }
  }, [videoCreatives, selectedCreative]);

  const handleCreativeSelect = (creative) => {
    setSelectedCreative(creative);
    setCurrentSecond(0);
    setIsPlaying(false);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">Second {label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="video-breakdown-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <Video size={24} className="page-icon" />
          <div>
            <h1>Video Breakdown</h1>
            <p className="last-synced">
              <Clock size={14} />
              Last synced 2 hours ago
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="page-description">
        Analyze frame-by-frame video performance. Understand viewer retention and engagement at
        every second of your video ads.
      </p>

      {/* Filter Bar */}
      <FilterBar showGroupBy={false} />

      {/* Main Content */}
      <div className="breakdown-content">
        {/* Creative Selector */}
        <div className="creative-selector">
          <h3>Select Creative</h3>
          <div className="creative-list">
            {videoCreatives.map((creative) => (
              <button
                key={creative.id}
                className={`creative-item ${
                  selectedCreative?.id === creative.id ? 'selected' : ''
                }`}
                onClick={() => handleCreativeSelect(creative)}
              >
                <img src={creative.thumbnail} alt={creative.name} />
                <div className="creative-info">
                  <span className="creative-name">{creative.name}</span>
                  <span className="creative-stats">
                    Hook Score: {creative.hookScore}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Video Analysis */}
        <div className="analysis-panel">
          {selectedCreative ? (
            <>
              {/* Video Player */}
              <div className="video-player">
                <div className="video-container">
                  <img
                    src={selectedCreative.thumbnail}
                    alt={selectedCreative.name}
                    className="video-placeholder"
                  />
                  <div className="video-overlay">
                    <button
                      className="play-btn"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                    </button>
                  </div>
                </div>
                <div className="video-controls">
                  <button className="control-btn">
                    <SkipBack size={18} />
                  </button>
                  <button
                    className="control-btn play"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button className="control-btn">
                    <SkipForward size={18} />
                  </button>
                  <div className="timeline">
                    <div className="timeline-track">
                      <div
                        className="timeline-progress"
                        style={{ width: `${(currentSecond / 10) * 100}%` }}
                      />
                    </div>
                    <span className="time-label">{currentSecond}s / 10s</span>
                  </div>
                </div>
              </div>

              {/* Retention Chart */}
              <div className="retention-chart">
                <h3>Retention & Engagement</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={videoBreakdownData.frameAnalysis}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="second"
                      label={{ value: 'Seconds', position: 'bottom' }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <ReferenceLine
                      x={3}
                      stroke="var(--warning-color)"
                      strokeDasharray="5 5"
                      label="Hook Zone"
                    />
                    <Line
                      type="monotone"
                      dataKey="retention"
                      name="Retention"
                      stroke="var(--primary-color)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      name="Engagement"
                      stroke="var(--success-color)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Key Moments */}
              <div className="key-moments">
                <h3>Key Moments</h3>
                <div className="moments-list">
                  {videoBreakdownData.keyMoments.map((moment, index) => (
                    <div
                      key={index}
                      className={`moment-card ${moment.performance}`}
                    >
                      <div className="moment-time">{moment.second}s</div>
                      <div className="moment-info">
                        <span className="moment-label">{moment.label}</span>
                        <span className={`moment-performance ${moment.performance}`}>
                          {moment.performance.charAt(0).toUpperCase() +
                            moment.performance.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics Summary */}
              <div className="metrics-summary">
                <h3>Performance Summary</h3>
                <div className="summary-grid">
                  <div className="summary-card">
                    <span className="summary-label">Hook Score</span>
                    <span className="summary-value">
                      {selectedCreative.hookScore}
                    </span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">Hold Score</span>
                    <span className="summary-value">
                      {selectedCreative.holdScore}
                    </span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">Thumbstop Rate</span>
                    <span className="summary-value">
                      {selectedCreative.thumbstop}%
                    </span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">First Frame Retention</span>
                    <span className="summary-value">
                      {selectedCreative.firstFrameRetention}%
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <Video size={48} />
              <p>Select a video creative to analyze</p>
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Loader size={32} className="spin" />
          </div>
          <h3 className="empty-state-title">Loading video data...</h3>
          <p className="empty-state-description">
            Fetching your video performance data from Meta.
          </p>
        </div>
      )}

      {!isLoading && videoCreatives.length === 0 && creativesData.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <AlertCircle size={32} />
          </div>
          <h3 className="empty-state-title">No video ad data found</h3>
          <p className="empty-state-description">
            No video ads found for the selected date range ({getDateRangeLabel()}).
            <br />
            Try selecting a different date range or check if your account has active video ads.
          </p>
        </div>
      )}

      {!isLoading && videoCreatives.length === 0 && creativesData.length > 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Video size={32} />
          </div>
          <h3 className="empty-state-title">No video creatives found</h3>
          <p className="empty-state-description">
            Your current data doesn't include any video creatives.
            <br />
            This analysis is available for video ad formats only.
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoBreakdown;
