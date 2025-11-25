import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Monitor,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Clock,
  MousePointer,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Target,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import './TopLandingPage.css';

const TopLandingPage = () => {
  const { creativesData, settings } = useApp();
  const [selectedLandingPage, setSelectedLandingPage] = useState(null);

  // Simulated landing page data (in real app, this would come from Meta API or UTM tracking)
  const landingPages = useMemo(() => {
    // Group creatives by landing page (simulated)
    const pages = [
      {
        id: 1,
        url: 'example.com/course-enrollment',
        name: 'Course Enrollment Page',
        adsCount: 8,
        spend: 45000,
        clicks: 3200,
        conversions: 128,
        conversionRate: 4.0,
        bounceRate: 42,
        avgTimeOnPage: '2:34',
        loadTime: 2.1,
        mobileScore: 85,
        status: 'performing',
      },
      {
        id: 2,
        url: 'example.com/free-class',
        name: 'Free Class Landing',
        adsCount: 5,
        spend: 32000,
        clicks: 2800,
        conversions: 196,
        conversionRate: 7.0,
        bounceRate: 35,
        avgTimeOnPage: '3:12',
        loadTime: 1.8,
        mobileScore: 92,
        status: 'top',
      },
      {
        id: 3,
        url: 'example.com/masterclass',
        name: 'Masterclass Registration',
        adsCount: 4,
        spend: 28000,
        clicks: 1900,
        conversions: 57,
        conversionRate: 3.0,
        bounceRate: 55,
        avgTimeOnPage: '1:45',
        loadTime: 3.2,
        mobileScore: 68,
        status: 'needs_work',
      },
      {
        id: 4,
        url: 'example.com/trial',
        name: 'Free Trial Page',
        adsCount: 3,
        spend: 18000,
        clicks: 1400,
        conversions: 84,
        conversionRate: 6.0,
        bounceRate: 38,
        avgTimeOnPage: '2:56',
        loadTime: 1.5,
        mobileScore: 90,
        status: 'performing',
      },
    ];

    return pages.sort((a, b) => b.conversionRate - a.conversionRate);
  }, []);

  // Conversion rate trend (simulated)
  const trendData = [
    { date: 'Week 1', rate: 4.2 },
    { date: 'Week 2', rate: 4.5 },
    { date: 'Week 3', rate: 5.1 },
    { date: 'Week 4', rate: 4.8 },
  ];

  // Overall stats
  const overallStats = useMemo(() => {
    const totalClicks = landingPages.reduce((sum, p) => sum + p.clicks, 0);
    const totalConversions = landingPages.reduce((sum, p) => sum + p.conversions, 0);
    const avgConversionRate = totalConversions / totalClicks * 100;
    const avgBounceRate = landingPages.reduce((sum, p) => sum + p.bounceRate, 0) / landingPages.length;

    return {
      totalClicks,
      totalConversions,
      avgConversionRate: avgConversionRate.toFixed(2),
      avgBounceRate: avgBounceRate.toFixed(0),
    };
  }, [landingPages]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'top':
        return <span className="status-badge top"><CheckCircle size={14} /> Top Performer</span>;
      case 'performing':
        return <span className="status-badge performing"><TrendingUp size={14} /> Performing</span>;
      case 'needs_work':
        return <span className="status-badge needs-work"><AlertTriangle size={14} /> Needs Work</span>;
      default:
        return null;
    }
  };

  // Landing page improvement suggestions
  const getImprovements = (page) => {
    const suggestions = [];

    if (page.loadTime > 2.5) {
      suggestions.push({
        type: 'critical',
        title: 'Slow Load Time',
        description: `Page loads in ${page.loadTime}s. Aim for under 2s to reduce bounce rate.`,
      });
    }

    if (page.mobileScore < 80) {
      suggestions.push({
        type: 'warning',
        title: 'Mobile Experience',
        description: `Mobile score is ${page.mobileScore}/100. Optimize for mobile devices.`,
      });
    }

    if (page.bounceRate > 50) {
      suggestions.push({
        type: 'warning',
        title: 'High Bounce Rate',
        description: `${page.bounceRate}% bounce rate. Improve above-fold content and CTA visibility.`,
      });
    }

    if (page.conversionRate < 4) {
      suggestions.push({
        type: 'suggestion',
        title: 'Low Conversion Rate',
        description: 'Test different headlines, CTAs, and social proof placement.',
      });
    }

    return suggestions;
  };

  return (
    <div className="top-landing-page">
      <div className="page-header">
        <div className="header-content">
          <h1>
            <Monitor size={24} />
            Top Landing Pages
          </h1>
          <p>Analyze landing page performance and optimize for conversions</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <MousePointer size={24} />
          <div className="stat-info">
            <span className="stat-value">{overallStats.totalClicks.toLocaleString()}</span>
            <span className="stat-label">Total Clicks</span>
          </div>
        </div>
        <div className="stat-card">
          <ShoppingCart size={24} />
          <div className="stat-info">
            <span className="stat-value">{overallStats.totalConversions}</span>
            <span className="stat-label">Total Conversions</span>
          </div>
        </div>
        <div className="stat-card">
          <Target size={24} />
          <div className="stat-info">
            <span className="stat-value">{overallStats.avgConversionRate}%</span>
            <span className="stat-label">Avg Conversion Rate</span>
          </div>
        </div>
        <div className="stat-card">
          <TrendingDown size={24} />
          <div className="stat-info">
            <span className="stat-value">{overallStats.avgBounceRate}%</span>
            <span className="stat-label">Avg Bounce Rate</span>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* Landing Pages List */}
        <div className="pages-section">
          <div className="section-header">
            <h2>Landing Pages Ranked by Conversion Rate</h2>
          </div>
          <div className="pages-list">
            {landingPages.map((page, index) => (
              <div
                key={page.id}
                className={`page-card ${selectedLandingPage?.id === page.id ? 'selected' : ''}`}
                onClick={() => setSelectedLandingPage(page)}
              >
                <div className="page-rank">#{index + 1}</div>
                <div className="page-info">
                  <div className="page-header-row">
                    <h3>{page.name}</h3>
                    {getStatusBadge(page.status)}
                  </div>
                  <span className="page-url">
                    <ExternalLink size={12} />
                    {page.url}
                  </span>
                  <div className="page-metrics">
                    <div className="metric">
                      <span className="metric-value">{page.conversionRate}%</span>
                      <span className="metric-label">Conv Rate</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">{page.bounceRate}%</span>
                      <span className="metric-label">Bounce</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">{page.clicks.toLocaleString()}</span>
                      <span className="metric-label">Clicks</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">{page.adsCount}</span>
                      <span className="metric-label">Ads</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Panel */}
        <div className="details-section">
          {selectedLandingPage ? (
            <>
              <div className="section-header">
                <h2>{selectedLandingPage.name}</h2>
              </div>

              <div className="detail-metrics">
                <div className="detail-metric">
                  <span className="label">Load Time</span>
                  <span className={`value ${selectedLandingPage.loadTime > 2.5 ? 'warning' : 'good'}`}>
                    {selectedLandingPage.loadTime}s
                  </span>
                </div>
                <div className="detail-metric">
                  <span className="label">Mobile Score</span>
                  <span className={`value ${selectedLandingPage.mobileScore < 80 ? 'warning' : 'good'}`}>
                    {selectedLandingPage.mobileScore}/100
                  </span>
                </div>
                <div className="detail-metric">
                  <span className="label">Avg Time on Page</span>
                  <span className="value">{selectedLandingPage.avgTimeOnPage}</span>
                </div>
                <div className="detail-metric">
                  <span className="label">Total Spend</span>
                  <span className="value">{settings?.currency || '₹'}{selectedLandingPage.spend.toLocaleString()}</span>
                </div>
              </div>

              <div className="improvements-section">
                <h3>Improvement Suggestions</h3>
                {getImprovements(selectedLandingPage).length > 0 ? (
                  <div className="improvements-list">
                    {getImprovements(selectedLandingPage).map((item, index) => (
                      <div key={index} className={`improvement-item ${item.type}`}>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-improvements">
                    <CheckCircle size={24} />
                    <p>This landing page is performing well!</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-details">
              <Monitor size={48} />
              <p>Select a landing page to see details</p>
            </div>
          )}
        </div>
      </div>

      {/* Conversion Rate Trend */}
      <div className="trend-section">
        <div className="section-header">
          <h2>Average Conversion Rate Trend</h2>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
              />
              <Line type="monotone" dataKey="rate" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} name="Conversion Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Practices */}
      <div className="practices-section">
        <h2>Landing Page Best Practices</h2>
        <div className="practices-grid">
          <div className="practice-card">
            <Clock size={24} />
            <h4>Fast Load Times</h4>
            <p>Keep page load under 2 seconds. Each second delay reduces conversions by 7%.</p>
          </div>
          <div className="practice-card">
            <Target size={24} />
            <h4>Clear CTA</h4>
            <p>Single, prominent call-to-action above the fold. Remove navigation distractions.</p>
          </div>
          <div className="practice-card">
            <CheckCircle size={24} />
            <h4>Social Proof</h4>
            <p>Include testimonials, reviews, or trust badges near your CTA.</p>
          </div>
          <div className="practice-card">
            <Monitor size={24} />
            <h4>Mobile First</h4>
            <p>70%+ of ad clicks are mobile. Design for mobile experience first.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopLandingPage;
