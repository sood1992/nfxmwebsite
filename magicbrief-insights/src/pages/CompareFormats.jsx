import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Video,
  Image,
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Eye,
  MousePointer,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import './CompareFormats.css';

const CompareFormats = () => {
  const { creativesData, getFilteredCreatives, settings } = useApp();
  const [selectedMetric, setSelectedMetric] = useState('ctr');

  // Group creatives by format type
  const formatAnalysis = useMemo(() => {
    const creatives = getFilteredCreatives();

    const videoCreatives = creatives.filter(c => c.type === 'Video');
    const imageCreatives = creatives.filter(c => c.type === 'Image');
    const carouselCreatives = creatives.filter(c => c.type === 'Carousel');

    const calculateAvg = (arr, metric) => {
      if (arr.length === 0) return 0;
      return arr.reduce((sum, c) => sum + (c[metric] || 0), 0) / arr.length;
    };

    const calculateTotal = (arr, metric) => {
      return arr.reduce((sum, c) => sum + (c[metric] || 0), 0);
    };

    return {
      video: {
        count: videoCreatives.length,
        spend: calculateTotal(videoCreatives, 'spend'),
        avgCtr: calculateAvg(videoCreatives, 'ctr'),
        avgCpm: calculateAvg(videoCreatives, 'cpm'),
        avgCpc: calculateAvg(videoCreatives, 'cpc'),
        avgHookScore: calculateAvg(videoCreatives, 'hookScore'),
        avgHoldScore: calculateAvg(videoCreatives, 'holdScore'),
        impressions: calculateTotal(videoCreatives, 'impressions'),
        clicks: calculateTotal(videoCreatives, 'clicks'),
      },
      image: {
        count: imageCreatives.length,
        spend: calculateTotal(imageCreatives, 'spend'),
        avgCtr: calculateAvg(imageCreatives, 'ctr'),
        avgCpm: calculateAvg(imageCreatives, 'cpm'),
        avgCpc: calculateAvg(imageCreatives, 'cpc'),
        avgHookScore: calculateAvg(imageCreatives, 'hookScore'),
        avgHoldScore: 0, // N/A for images
        impressions: calculateTotal(imageCreatives, 'impressions'),
        clicks: calculateTotal(imageCreatives, 'clicks'),
      },
      carousel: {
        count: carouselCreatives.length,
        spend: calculateTotal(carouselCreatives, 'spend'),
        avgCtr: calculateAvg(carouselCreatives, 'ctr'),
        avgCpm: calculateAvg(carouselCreatives, 'cpm'),
        avgCpc: calculateAvg(carouselCreatives, 'cpc'),
        avgHookScore: calculateAvg(carouselCreatives, 'hookScore'),
        avgHoldScore: 0,
        impressions: calculateTotal(carouselCreatives, 'impressions'),
        clicks: calculateTotal(carouselCreatives, 'clicks'),
      },
    };
  }, [getFilteredCreatives]);

  // Bar chart data
  const barChartData = useMemo(() => {
    return [
      {
        name: 'Video',
        ctr: formatAnalysis.video.avgCtr,
        cpm: formatAnalysis.video.avgCpm,
        cpc: formatAnalysis.video.avgCpc,
        hookScore: formatAnalysis.video.avgHookScore,
      },
      {
        name: 'Image',
        ctr: formatAnalysis.image.avgCtr,
        cpm: formatAnalysis.image.avgCpm,
        cpc: formatAnalysis.image.avgCpc,
        hookScore: formatAnalysis.image.avgHookScore,
      },
      {
        name: 'Carousel',
        ctr: formatAnalysis.carousel.avgCtr,
        cpm: formatAnalysis.carousel.avgCpm,
        cpc: formatAnalysis.carousel.avgCpc,
        hookScore: formatAnalysis.carousel.avgHookScore,
      },
    ];
  }, [formatAnalysis]);

  // Radar chart data
  const radarData = useMemo(() => {
    // Normalize values to 0-100 scale for radar chart
    const maxCtr = Math.max(formatAnalysis.video.avgCtr, formatAnalysis.image.avgCtr, formatAnalysis.carousel.avgCtr) || 1;
    const maxCpm = Math.max(formatAnalysis.video.avgCpm, formatAnalysis.image.avgCpm, formatAnalysis.carousel.avgCpm) || 1;
    const maxHook = Math.max(formatAnalysis.video.avgHookScore, formatAnalysis.image.avgHookScore, formatAnalysis.carousel.avgHookScore) || 1;

    return [
      {
        metric: 'CTR',
        Video: (formatAnalysis.video.avgCtr / maxCtr) * 100,
        Image: (formatAnalysis.image.avgCtr / maxCtr) * 100,
        Carousel: (formatAnalysis.carousel.avgCtr / maxCtr) * 100,
      },
      {
        metric: 'Efficiency',
        Video: formatAnalysis.video.avgCpm > 0 ? 100 - (formatAnalysis.video.avgCpm / maxCpm) * 50 : 0,
        Image: formatAnalysis.image.avgCpm > 0 ? 100 - (formatAnalysis.image.avgCpm / maxCpm) * 50 : 0,
        Carousel: formatAnalysis.carousel.avgCpm > 0 ? 100 - (formatAnalysis.carousel.avgCpm / maxCpm) * 50 : 0,
      },
      {
        metric: 'Hook Score',
        Video: formatAnalysis.video.avgHookScore,
        Image: formatAnalysis.image.avgHookScore,
        Carousel: formatAnalysis.carousel.avgHookScore,
      },
      {
        metric: 'Reach',
        Video: formatAnalysis.video.count > 0 ? Math.min(100, formatAnalysis.video.impressions / 10000) : 0,
        Image: formatAnalysis.image.count > 0 ? Math.min(100, formatAnalysis.image.impressions / 10000) : 0,
        Carousel: formatAnalysis.carousel.count > 0 ? Math.min(100, formatAnalysis.carousel.impressions / 10000) : 0,
      },
      {
        metric: 'Engagement',
        Video: formatAnalysis.video.count > 0 ? Math.min(100, formatAnalysis.video.clicks / 100) : 0,
        Image: formatAnalysis.image.count > 0 ? Math.min(100, formatAnalysis.image.clicks / 100) : 0,
        Carousel: formatAnalysis.carousel.count > 0 ? Math.min(100, formatAnalysis.carousel.clicks / 100) : 0,
      },
    ];
  }, [formatAnalysis]);

  // Get best format
  const bestFormat = useMemo(() => {
    const formats = ['video', 'image', 'carousel'];
    const scores = formats.map(f => ({
      name: f,
      score: (formatAnalysis[f].avgCtr * 20) + (formatAnalysis[f].avgHookScore * 0.5) - (formatAnalysis[f].avgCpm * 0.1),
    }));
    return scores.sort((a, b) => b.score - a.score)[0]?.name || 'video';
  }, [formatAnalysis]);

  const metrics = [
    { id: 'ctr', label: 'CTR %', color: '#6366f1' },
    { id: 'cpm', label: 'CPM', color: '#22c55e' },
    { id: 'cpc', label: 'CPC', color: '#eab308' },
    { id: 'hookScore', label: 'Hook Score', color: '#ec4899' },
  ];

  const formatIcons = {
    video: Video,
    image: Image,
    carousel: LayoutGrid,
  };

  return (
    <div className="compare-formats-page">
      <div className="page-header">
        <div className="header-content">
          <h1>
            <Layers size={24} />
            Compare Formats
          </h1>
          <p>Analyze performance across different ad formats</p>
        </div>
      </div>

      {/* Format Cards */}
      <div className="formats-grid">
        {['video', 'image', 'carousel'].map((format) => {
          const Icon = formatIcons[format];
          const data = formatAnalysis[format];
          const isBest = format === bestFormat && data.count > 0;

          return (
            <div key={format} className={`format-card ${isBest ? 'best' : ''}`}>
              {isBest && <span className="best-badge">Top Performer</span>}
              <div className="format-header">
                <div className="format-icon">
                  <Icon size={24} />
                </div>
                <div className="format-title">
                  <h3>{format.charAt(0).toUpperCase() + format.slice(1)}</h3>
                  <span className="format-count">{data.count} creatives</span>
                </div>
              </div>

              <div className="format-metrics">
                <div className="format-metric">
                  <span className="metric-label">Total Spend</span>
                  <span className="metric-value">
                    {settings?.currency || '₹'}{data.spend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="format-metric">
                  <span className="metric-label">Avg CTR</span>
                  <span className="metric-value">{data.avgCtr.toFixed(2)}%</span>
                </div>
                <div className="format-metric">
                  <span className="metric-label">Avg CPM</span>
                  <span className="metric-value">{settings?.currency || '₹'}{data.avgCpm.toFixed(2)}</span>
                </div>
                <div className="format-metric">
                  <span className="metric-label">Avg CPC</span>
                  <span className="metric-value">{settings?.currency || '₹'}{data.avgCpc.toFixed(2)}</span>
                </div>
                <div className="format-metric">
                  <span className="metric-label">Hook Score</span>
                  <span className="metric-value">{data.avgHookScore.toFixed(0)}</span>
                </div>
                <div className="format-metric">
                  <span className="metric-label">Impressions</span>
                  <span className="metric-value">{data.impressions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Bar Chart Comparison */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>Metric Comparison</h2>
            <div className="metric-selector">
              {metrics.map((metric) => (
                <button
                  key={metric.id}
                  className={selectedMetric === metric.id ? 'active' : ''}
                  onClick={() => setSelectedMetric(metric.id)}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
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
                <Bar
                  dataKey={selectedMetric}
                  fill={metrics.find(m => m.id === selectedMetric)?.color || '#6366f1'}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>Performance Overview</h2>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="metric" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <PolarRadiusAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <Radar name="Video" dataKey="Video" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                <Radar name="Image" dataKey="Image" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                <Radar name="Carousel" dataKey="Carousel" stroke="#eab308" fill="#eab308" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="insights-section">
        <h2>Key Insights</h2>
        <div className="insights-grid">
          {formatAnalysis.video.count > 0 && formatAnalysis.video.avgCtr > formatAnalysis.image.avgCtr && (
            <div className="insight-card positive">
              <TrendingUp size={20} />
              <div>
                <h4>Video Drives Higher CTR</h4>
                <p>Your video ads have {((formatAnalysis.video.avgCtr / formatAnalysis.image.avgCtr - 1) * 100).toFixed(0)}% higher CTR than static images.</p>
              </div>
            </div>
          )}

          {formatAnalysis.image.count > 0 && formatAnalysis.image.avgCpm < formatAnalysis.video.avgCpm && (
            <div className="insight-card">
              <BarChart2 size={20} />
              <div>
                <h4>Images More Cost-Efficient</h4>
                <p>Static images have {((1 - formatAnalysis.image.avgCpm / formatAnalysis.video.avgCpm) * 100).toFixed(0)}% lower CPM than video.</p>
              </div>
            </div>
          )}

          {formatAnalysis.video.avgHookScore > 70 && (
            <div className="insight-card positive">
              <Eye size={20} />
              <div>
                <h4>Strong Video Hooks</h4>
                <p>Your video hooks are performing well with an average score of {formatAnalysis.video.avgHookScore.toFixed(0)}.</p>
              </div>
            </div>
          )}

          <div className="insight-card recommendation">
            <MousePointer size={20} />
            <div>
              <h4>Format Recommendation</h4>
              <p>Based on your data, focus on <strong>{bestFormat}</strong> ads for optimal performance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Format Tips */}
      <div className="tips-section">
        <h2>Format Best Practices</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <Video size={24} />
            <h4>Video Ads</h4>
            <ul>
              <li>Hook in first 0.5 seconds</li>
              <li>Optimize for sound-off viewing</li>
              <li>Keep under 15 seconds for best retention</li>
              <li>End with clear CTA</li>
            </ul>
          </div>
          <div className="tip-card">
            <Image size={24} />
            <h4>Static Images</h4>
            <ul>
              <li>One clear focal point</li>
              <li>Minimal text (Facebook 20% rule)</li>
              <li>High contrast for mobile</li>
              <li>Test multiple aspect ratios</li>
            </ul>
          </div>
          <div className="tip-card">
            <LayoutGrid size={24} />
            <h4>Carousel Ads</h4>
            <ul>
              <li>Tell a story across cards</li>
              <li>Lead with strongest card</li>
              <li>3-5 cards optimal</li>
              <li>Consistent visual style</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareFormats;
