import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Bookmark,
  ChevronDown,
  Eye,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Lightbulb,
} from 'lucide-react';
import { MetricCard, ScoreCard } from '../components/Shared';
import { performanceMetrics, scoreMetrics, recommendations } from '../data/mockData';
import { useApp } from '../context/AppContext';
import './Dashboard.css';

const Dashboard = () => {
  const { getDateRangeLabel, settings } = useApp();
  const [showMetricsModal, setShowMetricsModal] = useState(false);

  const actionCards = [
    {
      icon: Plus,
      title: 'Uncover insights',
      description: 'Create a new report',
    },
    {
      icon: Edit3,
      title: 'Compare ad traits',
      description: 'Build a comparison report',
    },
    {
      icon: Bookmark,
      title: 'Creative tagging',
      description: 'Manage and organise',
    },
  ];

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'improvement':
        return <TrendingUp size={20} />;
      case 'insight':
        return <Lightbulb size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  const getRecommendationClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
      default:
        return '';
    }
  };

  return (
    <div className="dashboard-page">
      {/* Action Cards */}
      <div className="action-cards">
        {actionCards.map((card, index) => (
          <button key={index} className="action-card">
            <div className="action-icon">
              <card.icon size={20} />
            </div>
            <div className="action-content">
              <span className="action-title">{card.title}</span>
              <span className="action-description">{card.description}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Performance Section */}
      <section className="performance-section">
        <div className="section-header">
          <div className="section-title-group">
            <h2>Performance</h2>
            <button className="date-selector">
              <span>Last 14 days</span>
              <span className="date-range">{getDateRangeLabel()}</span>
              <ChevronDown size={16} />
            </button>
          </div>
          <button className="metrics-btn" onClick={() => setShowMetricsModal(true)}>
            <Eye size={16} />
            <span>Metrics</span>
          </button>
        </div>

        <div className="performance-grid">
          <MetricCard
            title="Spend"
            value={performanceMetrics.spend.value}
            currency={settings.currency}
            chartData={performanceMetrics.spend.chartData}
            chartColor="var(--primary-color)"
          />
          <MetricCard
            title="CPM"
            value={performanceMetrics.cpm.value}
            currency={settings.currency}
            trend={performanceMetrics.cpm.trend}
            status={performanceMetrics.cpm.status}
            chartData={performanceMetrics.cpm.chartData}
            chartColor="var(--success-color)"
          />
          <MetricCard
            title="CPC (All)"
            value={performanceMetrics.cpc.value}
            currency={settings.currency}
            trend={performanceMetrics.cpc.trend}
            status={performanceMetrics.cpc.status}
            chartData={performanceMetrics.cpc.chartData}
            chartColor="var(--success-color)"
          />
          <MetricCard
            title="CTR"
            value={performanceMetrics.ctr.value}
            unit="%"
            trend={performanceMetrics.ctr.trend}
            status={performanceMetrics.ctr.status}
            chartData={performanceMetrics.ctr.chartData}
            chartColor="var(--primary-color)"
          />
        </div>
      </section>

      {/* Score Cards Section */}
      <section className="scores-section">
        <div className="scores-grid">
          <ScoreCard
            title="Hook Score"
            score={scoreMetrics.hookScore}
            benchmark={settings.benchmarks.hookScore}
          />
          <ScoreCard
            title="Hold Score"
            score={scoreMetrics.holdScore}
            benchmark={settings.benchmarks.holdScore}
          />
          <ScoreCard
            title="Click Score"
            score={scoreMetrics.clickScore}
            benchmark={settings.benchmarks.clickScore}
          />
          <ScoreCard
            title="Buy Score"
            score={scoreMetrics.buyScore}
            description="No purchase data available"
          />
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="recommendations-section">
        <div className="section-header">
          <h2>Recommendations</h2>
          <span className="beta-badge">Beta</span>
        </div>

        {recommendations.length > 0 ? (
          <div className="recommendations-list">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`recommendation-card ${getRecommendationClass(rec.priority)}`}
              >
                <div className="recommendation-icon">
                  {getRecommendationIcon(rec.type)}
                </div>
                <div className="recommendation-content">
                  <h4>{rec.title}</h4>
                  <p>{rec.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-recommendations">
            <AlertCircle size={20} />
            <span>No recommendations found. Please try again later.</span>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
