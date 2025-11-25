import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  RefreshCw,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Play,
  Sparkles,
  ChevronRight,
  Target,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './IterateOnHook.css';

const IterateOnHook = () => {
  const { creativesData, getFilteredCreatives, settings } = useApp();
  const [selectedCreative, setSelectedCreative] = useState(null);

  // Get creatives sorted by hook score
  const hookAnalysis = useMemo(() => {
    const creatives = getFilteredCreatives();
    const avgHookScore = creatives.reduce((sum, c) => sum + (c.hookScore || 0), 0) / creatives.length;

    const topPerformers = creatives
      .filter(c => c.hookScore >= (settings?.benchmarks?.hookScore || 70))
      .sort((a, b) => b.hookScore - a.hookScore)
      .slice(0, 5);

    const needsImprovement = creatives
      .filter(c => c.hookScore < (settings?.benchmarks?.hookScore || 70))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 5);

    return { avgHookScore, topPerformers, needsImprovement };
  }, [getFilteredCreatives, settings]);

  // Generate hook improvement suggestions
  const getSuggestions = (creative) => {
    const suggestions = [];

    if (creative.hookScore < 60) {
      suggestions.push({
        type: 'critical',
        title: 'Add a stronger opening',
        description: 'Consider starting with a bold statement, question, or surprising visual within the first 0.5 seconds',
        impact: 'High',
      });
    }

    if (creative.thumbstop < 30) {
      suggestions.push({
        type: 'warning',
        title: 'Improve thumbstop rate',
        description: 'Use bright colors, faces, or movement in the first frame to catch attention',
        impact: 'High',
      });
    }

    if (creative.firstFrameRetention < 85) {
      suggestions.push({
        type: 'suggestion',
        title: 'Optimize first 3 seconds',
        description: 'Front-load your value proposition - show the benefit immediately',
        impact: 'Medium',
      });
    }

    if (creative.type === 'Video' && creative.holdScore < creative.hookScore * 0.8) {
      suggestions.push({
        type: 'suggestion',
        title: 'Bridge hook to content',
        description: 'Your hook grabs attention but viewers drop off. Create a smoother transition to main content',
        impact: 'Medium',
      });
    }

    // Always add some generic best practices
    suggestions.push({
      type: 'tip',
      title: 'Test pattern interrupts',
      description: 'Try unexpected visuals, text animations, or sound effects to stop the scroll',
      impact: 'Variable',
    });

    return suggestions;
  };

  // Hook performance trends (simulated)
  const trendData = [
    { week: 'Week 1', avgScore: 72, benchmark: 70 },
    { week: 'Week 2', avgScore: 74, benchmark: 70 },
    { week: 'Week 3', avgScore: 71, benchmark: 70 },
    { week: 'Week 4', avgScore: 76, benchmark: 70 },
  ];

  return (
    <div className="iterate-hook-page">
      <div className="page-header">
        <div className="header-content">
          <h1>
            <RefreshCw size={24} />
            Iterate on Hook
          </h1>
          <p>Analyze and improve your creative hooks to stop the scroll</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Target size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Average Hook Score</span>
            <span className="stat-value">{hookAnalysis.avgHookScore.toFixed(0)}</span>
          </div>
          <div className={`stat-trend ${hookAnalysis.avgHookScore >= 70 ? 'positive' : 'negative'}`}>
            {hookAnalysis.avgHookScore >= 70 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{hookAnalysis.avgHookScore >= 70 ? 'Above' : 'Below'} benchmark</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Sparkles size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Top Performers</span>
            <span className="stat-value">{hookAnalysis.topPerformers.length}</span>
          </div>
          <div className="stat-trend positive">
            <span>Score 70+</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Needs Improvement</span>
            <span className="stat-value">{hookAnalysis.needsImprovement.length}</span>
          </div>
          <div className="stat-trend">
            <span>Below benchmark</span>
          </div>
        </div>
      </div>

      {/* Hook Score Trend */}
      <div className="chart-section">
        <div className="section-header">
          <h2>Hook Performance Trend</h2>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="avgScore"
                stroke="#6366f1"
                fill="rgba(99, 102, 241, 0.2)"
                name="Avg Hook Score"
              />
              <Area
                type="monotone"
                dataKey="benchmark"
                stroke="#22c55e"
                fill="none"
                strokeDasharray="5 5"
                name="Benchmark"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="content-grid">
        {/* Creatives needing improvement */}
        <div className="creatives-section">
          <div className="section-header">
            <h2>Creatives to Optimize</h2>
            <span className="section-subtitle">High spend, low hook score</span>
          </div>
          <div className="creative-list">
            {hookAnalysis.needsImprovement.map((creative) => (
              <div
                key={creative.id}
                className={`creative-item ${selectedCreative?.id === creative.id ? 'selected' : ''}`}
                onClick={() => setSelectedCreative(creative)}
              >
                <div className="creative-thumbnail">
                  {creative.thumbnail ? (
                    <img src={creative.thumbnail} alt={creative.name} />
                  ) : (
                    <div className="thumbnail-placeholder">
                      <Play size={24} />
                    </div>
                  )}
                </div>
                <div className="creative-info">
                  <h4>{creative.name}</h4>
                  <span className="creative-headline">{creative.headline}</span>
                  <div className="creative-metrics">
                    <span className="metric">
                      <strong>Hook:</strong> {creative.hookScore || 'N/A'}
                    </span>
                    <span className="metric">
                      <strong>Spend:</strong> {settings?.currency || '₹'}{creative.spend?.toLocaleString()}
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} className="chevron" />
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions Panel */}
        <div className="suggestions-section">
          <div className="section-header">
            <h2>
              <Lightbulb size={20} />
              Improvement Suggestions
            </h2>
          </div>
          {selectedCreative ? (
            <div className="suggestions-content">
              <div className="selected-creative-header">
                <h3>{selectedCreative.name}</h3>
                <div className="score-badge">
                  Hook Score: {selectedCreative.hookScore}
                </div>
              </div>
              <div className="suggestions-list">
                {getSuggestions(selectedCreative).map((suggestion, index) => (
                  <div key={index} className={`suggestion-card ${suggestion.type}`}>
                    <div className="suggestion-header">
                      {suggestion.type === 'critical' && <AlertTriangle size={18} />}
                      {suggestion.type === 'warning' && <Zap size={18} />}
                      {suggestion.type === 'suggestion' && <Lightbulb size={18} />}
                      {suggestion.type === 'tip' && <Sparkles size={18} />}
                      <h4>{suggestion.title}</h4>
                    </div>
                    <p>{suggestion.description}</p>
                    <span className="impact-badge">Impact: {suggestion.impact}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-suggestions">
              <Lightbulb size={48} />
              <p>Select a creative to see improvement suggestions</p>
            </div>
          )}
        </div>
      </div>

      {/* Best Practices */}
      <div className="best-practices">
        <h2>Hook Best Practices</h2>
        <div className="practices-grid">
          <div className="practice-card">
            <div className="practice-icon">
              <span>0.5s</span>
            </div>
            <h4>First Half Second</h4>
            <p>Your hook must grab attention within 0.5 seconds. Use movement, faces, or bold text.</p>
          </div>
          <div className="practice-card">
            <div className="practice-icon">
              <span>?</span>
            </div>
            <h4>Ask Questions</h4>
            <p>Start with a curiosity-inducing question that your target audience can't ignore.</p>
          </div>
          <div className="practice-card">
            <div className="practice-icon">
              <span>!</span>
            </div>
            <h4>Pattern Interrupt</h4>
            <p>Do something unexpected. Break the visual pattern of the feed to stop scrolling.</p>
          </div>
          <div className="practice-card">
            <div className="practice-icon">
              <span>A/B</span>
            </div>
            <h4>Test Variations</h4>
            <p>Create 3-5 hook variations for each winning creative and test them against each other.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IterateOnHook;
