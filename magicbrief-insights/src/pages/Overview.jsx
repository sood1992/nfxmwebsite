import React from 'react';
import { BarChart2, Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { performanceMetrics, creatives } from '../data/mockData';
import { useApp } from '../context/AppContext';
import './Overview.css';

const Overview = () => {
  const { settings, getDateRangeLabel } = useApp();

  // Prepare trend data
  const trendData = performanceMetrics.spend.chartData.map((item, index) => ({
    date: item.date,
    spend: item.value,
    impressions: Math.round(item.value * 10),
    clicks: Math.round(item.value * 0.1),
    ctr: performanceMetrics.ctr.chartData[index]?.value || 1.1,
  }));

  const topPerformers = [...creatives]
    .sort((a, b) => b.hookScore - a.hookScore)
    .slice(0, 5);

  const underperformers = [...creatives]
    .sort((a, b) => a.hookScore - b.hookScore)
    .slice(0, 3);

  const summaryStats = [
    {
      label: 'Total Spend',
      value: `${settings.currency}${(performanceMetrics.spend.value / 100000).toFixed(2)}L`,
      change: '+12%',
      trend: 'up',
    },
    {
      label: 'Impressions',
      value: '1.78M',
      change: '+8%',
      trend: 'up',
    },
    {
      label: 'Clicks',
      value: '20.1K',
      change: '-5%',
      trend: 'down',
    },
    {
      label: 'Conversions',
      value: '842',
      change: '+15%',
      trend: 'up',
    },
  ];

  return (
    <div className="overview-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <BarChart2 size={24} className="page-icon" />
          <h1>Overview</h1>
        </div>
        <div className="header-actions">
          <button className="date-btn">
            <Calendar size={16} />
            <span>{getDateRangeLabel()}</span>
          </button>
          <button className="export-btn">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        {summaryStats.map((stat, index) => (
          <div key={index} className="summary-stat">
            <span className="stat-label">{stat.label}</span>
            <div className="stat-value-row">
              <span className="stat-value">{stat.value}</span>
              <span className={`stat-change ${stat.trend}`}>
                {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Spend Over Time */}
        <div className="chart-card large">
          <h3>Spend Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `${settings.currency}${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                formatter={(value) => [`${settings.currency}${value.toLocaleString()}`, 'Spend']}
              />
              <Area
                type="monotone"
                dataKey="spend"
                stroke="var(--primary-color)"
                fill="var(--primary-bg)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* CTR Trend */}
        <div className="chart-card">
          <h3>CTR Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 2]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value) => [`${value}%`, 'CTR']} />
              <Line
                type="monotone"
                dataKey="ctr"
                stroke="var(--success-color)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement */}
        <div className="chart-card">
          <h3>Impressions vs Clicks</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="impressions"
                name="Impressions"
                stroke="var(--primary-color)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="clicks"
                name="Clicks"
                stroke="var(--warning-color)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Tables */}
      <div className="performance-tables">
        {/* Top Performers */}
        <div className="performance-card">
          <h3>Top Performers</h3>
          <table className="performance-table">
            <thead>
              <tr>
                <th>Creative</th>
                <th>Hook Score</th>
                <th>Spend</th>
                <th>CTR</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((creative) => (
                <tr key={creative.id}>
                  <td>
                    <div className="creative-cell">
                      <img src={creative.thumbnail} alt={creative.name} />
                      <span>{creative.name}</span>
                    </div>
                  </td>
                  <td className="score good">{creative.hookScore}</td>
                  <td>{settings.currency}{creative.spend.toLocaleString('en-IN')}</td>
                  <td>{creative.ctr}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Needs Attention */}
        <div className="performance-card">
          <h3>Needs Attention</h3>
          <table className="performance-table">
            <thead>
              <tr>
                <th>Creative</th>
                <th>Hook Score</th>
                <th>Issue</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {underperformers.map((creative) => (
                <tr key={creative.id}>
                  <td>
                    <div className="creative-cell">
                      <img src={creative.thumbnail} alt={creative.name} />
                      <span>{creative.name}</span>
                    </div>
                  </td>
                  <td className="score poor">{creative.hookScore}</td>
                  <td className="issue">Low Hook Rate</td>
                  <td>
                    <button className="action-link">Optimize</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
