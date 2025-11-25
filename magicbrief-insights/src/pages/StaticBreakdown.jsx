import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Image,
  Grid3x3,
  Palette,
  Type,
  Eye,
  TrendingUp,
  Info,
  ZoomIn,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './StaticBreakdown.css';

const StaticBreakdown = () => {
  const { creativesData, getFilteredCreatives, settings } = useApp();
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisView, setAnalysisView] = useState('performance');

  // Get static (image) creatives
  const staticCreatives = useMemo(() => {
    return getFilteredCreatives().filter(c => c.type === 'Image' || c.type === 'Carousel');
  }, [getFilteredCreatives]);

  // Performance analysis
  const performanceData = useMemo(() => {
    if (staticCreatives.length === 0) return [];

    return staticCreatives.map(c => ({
      name: c.name.substring(0, 15) + (c.name.length > 15 ? '...' : ''),
      hookScore: c.hookScore || 0,
      ctr: c.ctr || 0,
      spend: c.spend || 0,
    }));
  }, [staticCreatives]);

  // Design elements analysis (simulated)
  const designAnalysis = {
    colorSchemes: [
      { name: 'Bright/Vibrant', count: 4, avgCtr: 1.32 },
      { name: 'Dark/Moody', count: 2, avgCtr: 0.98 },
      { name: 'Neutral/Minimal', count: 3, avgCtr: 1.15 },
      { name: 'Brand Colors', count: 5, avgCtr: 1.21 },
    ],
    textPlacement: [
      { name: 'Top Third', count: 6, avgCtr: 1.28 },
      { name: 'Center', count: 4, avgCtr: 1.15 },
      { name: 'Bottom Third', count: 3, avgCtr: 1.02 },
      { name: 'No Text', count: 2, avgCtr: 0.89 },
    ],
    imageTypes: [
      { name: 'Product Focus', count: 5, avgCtr: 1.18 },
      { name: 'Lifestyle', count: 4, avgCtr: 1.35 },
      { name: 'UGC Style', count: 3, avgCtr: 1.42 },
      { name: 'Graphic/Illustration', count: 2, avgCtr: 0.95 },
    ],
  };

  // Static image best practices
  const bestPractices = [
    {
      icon: Eye,
      title: 'Visual Hierarchy',
      description: 'Guide the eye from headline to product to CTA using size, color, and placement',
    },
    {
      icon: Type,
      title: 'Readable Text',
      description: 'Keep text large enough to read on mobile. Use high contrast against backgrounds',
    },
    {
      icon: Palette,
      title: 'Color Psychology',
      description: 'Use colors that evoke the right emotion. Red for urgency, blue for trust, green for health',
    },
    {
      icon: Grid3x3,
      title: 'Rule of Thirds',
      description: 'Place key elements along grid lines for more visually appealing compositions',
    },
  ];

  return (
    <div className="static-breakdown-page">
      <div className="page-header">
        <div className="header-content">
          <h1>
            <Image size={24} />
            Static Breakdown
          </h1>
          <p>Analyze your static image ads for design patterns and performance</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <Image size={20} />
          <div className="stat-info">
            <span className="stat-value">{staticCreatives.length}</span>
            <span className="stat-label">Static Creatives</span>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp size={20} />
          <div className="stat-info">
            <span className="stat-value">
              {(staticCreatives.reduce((sum, c) => sum + (c.ctr || 0), 0) / staticCreatives.length || 0).toFixed(2)}%
            </span>
            <span className="stat-label">Avg CTR</span>
          </div>
        </div>
        <div className="stat-card">
          <Eye size={20} />
          <div className="stat-info">
            <span className="stat-value">
              {staticCreatives.reduce((sum, c) => sum + (c.impressions || 0), 0).toLocaleString()}
            </span>
            <span className="stat-label">Total Impressions</span>
          </div>
        </div>
      </div>

      {staticCreatives.length > 0 ? (
        <>
          {/* Performance Chart */}
          <div className="chart-section">
            <div className="section-header">
              <h2>Static Creative Performance</h2>
              <div className="view-toggle">
                <button
                  className={analysisView === 'performance' ? 'active' : ''}
                  onClick={() => setAnalysisView('performance')}
                >
                  Performance
                </button>
                <button
                  className={analysisView === 'design' ? 'active' : ''}
                  onClick={() => setAnalysisView('design')}
                >
                  Design Analysis
                </button>
              </div>
            </div>

            {analysisView === 'performance' ? (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: '#1a1a2e',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="hookScore" fill="#6366f1" name="Hook Score" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="ctr" fill="#22c55e" name="CTR %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="design-analysis">
                <div className="analysis-grid">
                  <div className="analysis-card">
                    <h3>
                      <Palette size={18} />
                      Color Schemes
                    </h3>
                    <div className="analysis-items">
                      {designAnalysis.colorSchemes.map((item, index) => (
                        <div key={index} className="analysis-item">
                          <span className="item-name">{item.name}</span>
                          <span className="item-count">{item.count} ads</span>
                          <span className="item-metric">CTR: {item.avgCtr}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="analysis-card">
                    <h3>
                      <Type size={18} />
                      Text Placement
                    </h3>
                    <div className="analysis-items">
                      {designAnalysis.textPlacement.map((item, index) => (
                        <div key={index} className="analysis-item">
                          <span className="item-name">{item.name}</span>
                          <span className="item-count">{item.count} ads</span>
                          <span className="item-metric">CTR: {item.avgCtr}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="analysis-card">
                    <h3>
                      <Image size={18} />
                      Image Types
                    </h3>
                    <div className="analysis-items">
                      {designAnalysis.imageTypes.map((item, index) => (
                        <div key={index} className="analysis-item">
                          <span className="item-name">{item.name}</span>
                          <span className="item-count">{item.count} ads</span>
                          <span className="item-metric">CTR: {item.avgCtr}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Creative Gallery */}
          <div className="gallery-section">
            <div className="section-header">
              <h2>Creative Gallery</h2>
            </div>
            <div className="gallery-grid">
              {staticCreatives.map((creative) => (
                <div
                  key={creative.id}
                  className={`gallery-item ${selectedImage?.id === creative.id ? 'selected' : ''}`}
                  onClick={() => setSelectedImage(creative)}
                >
                  <div className="gallery-thumbnail">
                    {creative.thumbnail ? (
                      <img src={creative.thumbnail} alt={creative.name} />
                    ) : (
                      <div className="thumbnail-placeholder">
                        <Image size={32} />
                      </div>
                    )}
                    <div className="thumbnail-overlay">
                      <ZoomIn size={20} />
                    </div>
                  </div>
                  <div className="gallery-info">
                    <h4>{creative.name}</h4>
                    <div className="gallery-metrics">
                      <span>Hook: {creative.hookScore || 'N/A'}</span>
                      <span>CTR: {creative.ctr?.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <Image size={64} />
          <h3>No Static Creatives Found</h3>
          <p>You don't have any image or carousel ads in your current selection. Try adjusting your filters or date range.</p>
        </div>
      )}

      {/* Best Practices */}
      <div className="practices-section">
        <h2>Static Image Best Practices</h2>
        <div className="practices-grid">
          {bestPractices.map((practice, index) => (
            <div key={index} className="practice-card">
              <practice.icon size={24} className="practice-icon" />
              <h4>{practice.title}</h4>
              <p>{practice.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="tips-banner">
        <Info size={20} />
        <div className="tips-content">
          <h4>Pro Tip: Mobile-First Design</h4>
          <p>85% of Facebook ad views happen on mobile. Design for small screens first, then adapt for desktop.</p>
        </div>
      </div>
    </div>
  );
};

export default StaticBreakdown;
