import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Megaphone,
  Target,
  MousePointer,
  ShoppingCart,
  TrendingUp,
  Lightbulb,
  Copy,
  CheckCircle,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './IterateOnCTA.css';

const IterateOnCTA = () => {
  const { creativesData, getFilteredCreatives, settings } = useApp();
  const [copiedText, setCopiedText] = useState(null);

  // CTA Analysis
  const ctaAnalysis = useMemo(() => {
    const creatives = getFilteredCreatives();

    // Calculate average click metrics
    const avgClickScore = creatives.reduce((sum, c) => sum + (c.clickScore || 0), 0) / creatives.length;
    const avgCtr = creatives.reduce((sum, c) => sum + (c.ctr || 0), 0) / creatives.length;

    // Group by CTA performance
    const highConverters = creatives.filter(c => c.clickScore >= 75);
    const mediumConverters = creatives.filter(c => c.clickScore >= 50 && c.clickScore < 75);
    const lowConverters = creatives.filter(c => c.clickScore < 50);

    return {
      avgClickScore,
      avgCtr,
      distribution: [
        { name: 'High (75+)', value: highConverters.length, color: '#22c55e' },
        { name: 'Medium (50-74)', value: mediumConverters.length, color: '#eab308' },
        { name: 'Low (<50)', value: lowConverters.length, color: '#ef4444' },
      ],
      topPerformers: creatives.sort((a, b) => (b.clickScore || 0) - (a.clickScore || 0)).slice(0, 5),
      creativesWithPurchases: creatives.filter(c => c.purchases > 0),
    };
  }, [getFilteredCreatives]);

  // CTA Templates by objective
  const ctaTemplates = {
    awareness: [
      'Learn More',
      'Discover Now',
      'Find Out How',
      'See What\'s Possible',
      'Explore Today',
    ],
    consideration: [
      'Get Started Free',
      'Start Your Journey',
      'Try It Now',
      'See How It Works',
      'Watch Demo',
    ],
    conversion: [
      'Buy Now - Limited Time',
      'Claim Your Discount',
      'Enroll Today',
      'Get Instant Access',
      'Start Free Trial',
    ],
    urgency: [
      'Last Chance - Ends Tonight',
      'Only X Left',
      'Don\'t Miss Out',
      '48 Hours Only',
      'Sale Ends Soon',
    ],
  };

  // Best practices for CTAs
  const bestPractices = [
    {
      title: 'Use Action Verbs',
      description: 'Start with strong verbs like "Get", "Start", "Discover", "Join"',
      icon: Target,
    },
    {
      title: 'Create Urgency',
      description: 'Add time-sensitive language: "Today", "Now", "Limited Time"',
      icon: TrendingUp,
    },
    {
      title: 'Be Specific',
      description: 'Tell users exactly what they\'ll get: "Download Free Guide"',
      icon: MousePointer,
    },
    {
      title: 'Match the Funnel',
      description: 'Align CTA with audience temperature (cold/warm/hot)',
      icon: ShoppingCart,
    },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="iterate-cta-page">
      <div className="page-header">
        <div className="header-content">
          <h1>
            <Megaphone size={24} />
            Iterate on CTA
          </h1>
          <p>Optimize your call-to-action to drive more clicks and conversions</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-row">
        <div className="stat-card">
          <MousePointer size={24} className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{ctaAnalysis.avgClickScore.toFixed(0)}</span>
            <span className="stat-label">Avg Click Score</span>
          </div>
        </div>
        <div className="stat-card">
          <Target size={24} className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{ctaAnalysis.avgCtr.toFixed(2)}%</span>
            <span className="stat-label">Average CTR</span>
          </div>
        </div>
        <div className="stat-card">
          <ShoppingCart size={24} className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{ctaAnalysis.creativesWithPurchases.length}</span>
            <span className="stat-label">Converting Ads</span>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* Distribution Chart */}
        <div className="chart-card">
          <h2>Click Score Distribution</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={ctaAnalysis.distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {ctaAnalysis.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            {ctaAnalysis.distribution.map((item) => (
              <div key={item.name} className="legend-item">
                <span className="legend-color" style={{ background: item.color }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="performers-card">
          <h2>Top Click Performers</h2>
          <div className="performers-list">
            {ctaAnalysis.topPerformers.map((creative, index) => (
              <div key={creative.id} className="performer-item">
                <span className="rank">#{index + 1}</span>
                <div className="performer-info">
                  <h4>{creative.name}</h4>
                  <span className="headline">{creative.headline}</span>
                </div>
                <div className="performer-metrics">
                  <div className="metric">
                    <span className="metric-value">{creative.clickScore || 'N/A'}</span>
                    <span className="metric-label">Click Score</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{creative.ctr?.toFixed(2)}%</span>
                    <span className="metric-label">CTR</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Templates */}
      <div className="templates-section">
        <h2>
          <Lightbulb size={20} />
          CTA Templates by Objective
        </h2>
        <div className="templates-grid">
          {Object.entries(ctaTemplates).map(([objective, templates]) => (
            <div key={objective} className="template-card">
              <h3>{objective.charAt(0).toUpperCase() + objective.slice(1)}</h3>
              <div className="template-list">
                {templates.map((template, index) => (
                  <div key={index} className="template-item">
                    <span>{template}</span>
                    <button
                      className="copy-btn"
                      onClick={() => copyToClipboard(template)}
                    >
                      {copiedText === template ? (
                        <CheckCircle size={16} className="copied" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="practices-section">
        <h2>CTA Best Practices</h2>
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

      {/* A/B Testing Tips */}
      <div className="testing-section">
        <h2>A/B Testing Your CTAs</h2>
        <div className="testing-tips">
          <div className="tip">
            <span className="tip-number">1</span>
            <div className="tip-content">
              <h4>Test One Variable</h4>
              <p>Change only the CTA text, keeping everything else the same for accurate results.</p>
            </div>
          </div>
          <div className="tip">
            <span className="tip-number">2</span>
            <div className="tip-content">
              <h4>Run for Sufficient Time</h4>
              <p>Let tests run for at least 7 days or 1000 impressions per variant.</p>
            </div>
          </div>
          <div className="tip">
            <span className="tip-number">3</span>
            <div className="tip-content">
              <h4>Track Beyond Clicks</h4>
              <p>Measure conversions, not just CTR. A high-CTR CTA may not convert.</p>
            </div>
          </div>
          <div className="tip">
            <span className="tip-number">4</span>
            <div className="tip-content">
              <h4>Iterate Continuously</h4>
              <p>The winning CTA today may fatigue tomorrow. Keep testing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IterateOnCTA;
