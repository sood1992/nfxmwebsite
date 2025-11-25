import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  TrendingUp,
  Copy,
  CheckCircle,
  Sparkles,
  Hash,
  AlignLeft,
  Target,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './TopCopy.css';

const TopCopy = () => {
  const { creativesData, getFilteredCreatives, settings } = useApp();
  const [copiedText, setCopiedText] = useState(null);
  const [sortBy, setSortBy] = useState('ctr');

  // Get creatives with copy/headline
  const creativesWithCopy = useMemo(() => {
    const creatives = getFilteredCreatives().filter(c => c.headline);

    return creatives.sort((a, b) => {
      if (sortBy === 'ctr') return (b.ctr || 0) - (a.ctr || 0);
      if (sortBy === 'spend') return (b.spend || 0) - (a.spend || 0);
      if (sortBy === 'clicks') return (b.clicks || 0) - (a.clicks || 0);
      return 0;
    });
  }, [getFilteredCreatives, sortBy]);

  // Analyze copy patterns
  const copyAnalysis = useMemo(() => {
    const headlines = creativesWithCopy.map(c => c.headline || '');

    // Word count analysis
    const wordCounts = headlines.map(h => h.split(' ').length);
    const avgWordCount = wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length || 0;

    // Character count analysis
    const charCounts = headlines.map(h => h.length);
    const avgCharCount = charCounts.reduce((a, b) => a + b, 0) / charCounts.length || 0;

    // Question detection
    const questionsCount = headlines.filter(h => h.includes('?')).length;

    // Number detection
    const numbersCount = headlines.filter(h => /\d/.test(h)).length;

    // Emotion words
    const emotionWords = ['amazing', 'incredible', 'love', 'best', 'free', 'easy', 'fast', 'new'];
    const emotionalCount = headlines.filter(h =>
      emotionWords.some(w => h.toLowerCase().includes(w))
    ).length;

    return {
      avgWordCount: avgWordCount.toFixed(1),
      avgCharCount: avgCharCount.toFixed(0),
      questionsCount,
      numbersCount,
      emotionalCount,
      totalCopy: headlines.length,
    };
  }, [creativesWithCopy]);

  // Performance by copy length
  const lengthPerformance = useMemo(() => {
    const short = creativesWithCopy.filter(c => (c.headline?.length || 0) < 40);
    const medium = creativesWithCopy.filter(c => (c.headline?.length || 0) >= 40 && (c.headline?.length || 0) < 80);
    const long = creativesWithCopy.filter(c => (c.headline?.length || 0) >= 80);

    const avgCtr = (arr) => arr.length ? (arr.reduce((sum, c) => sum + (c.ctr || 0), 0) / arr.length).toFixed(2) : 0;

    return [
      { name: 'Short (<40 chars)', count: short.length, avgCtr: avgCtr(short) },
      { name: 'Medium (40-80 chars)', count: medium.length, avgCtr: avgCtr(medium) },
      { name: 'Long (80+ chars)', count: long.length, avgCtr: avgCtr(long) },
    ];
  }, [creativesWithCopy]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Copy templates
  const copyTemplates = [
    {
      category: 'Question Hooks',
      examples: [
        'Want to [achieve goal] in just [timeframe]?',
        'Still struggling with [pain point]?',
        'What if you could [benefit] without [common objection]?',
      ],
    },
    {
      category: 'Number Hooks',
      examples: [
        '[Number] reasons why [target audience] love [product]',
        'How I [achieved result] in [number] days',
        '[Number]% of [target audience] don\'t know this secret',
      ],
    },
    {
      category: 'Story Hooks',
      examples: [
        'How [person name] went from [before] to [after]',
        'I was skeptical until I tried [product]...',
        'Everyone told me [objection], but then...',
      ],
    },
    {
      category: 'Social Proof',
      examples: [
        'Join [number]+ happy customers',
        '[Famous brand/person] uses this exact method',
        'As seen in [publication/show]',
      ],
    },
  ];

  return (
    <div className="top-copy-page">
      <div className="page-header">
        <div className="header-content">
          <h1>
            <FileText size={24} />
            Top Copy
          </h1>
          <p>Analyze your best performing ad copy and headlines</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <AlignLeft size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{copyAnalysis.avgWordCount}</span>
            <span className="stat-label">Avg Word Count</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Hash size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{copyAnalysis.avgCharCount}</span>
            <span className="stat-label">Avg Characters</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon question">
            <span>?</span>
          </div>
          <div className="stat-info">
            <span className="stat-value">{copyAnalysis.questionsCount}</span>
            <span className="stat-label">Question Headlines</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon number">
            <span>#</span>
          </div>
          <div className="stat-info">
            <span className="stat-value">{copyAnalysis.numbersCount}</span>
            <span className="stat-label">Headlines with Numbers</span>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* Top Performing Copy */}
        <div className="copy-list-section">
          <div className="section-header">
            <h2>Top Performing Headlines</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="ctr">Sort by CTR</option>
              <option value="spend">Sort by Spend</option>
              <option value="clicks">Sort by Clicks</option>
            </select>
          </div>
          <div className="copy-list">
            {creativesWithCopy.slice(0, 10).map((creative, index) => (
              <div key={creative.id} className="copy-item">
                <span className="copy-rank">#{index + 1}</span>
                <div className="copy-content">
                  <p className="copy-text">{creative.headline}</p>
                  <div className="copy-meta">
                    <span className="creative-name">{creative.name}</span>
                    <span className="char-count">{creative.headline?.length} chars</span>
                  </div>
                </div>
                <div className="copy-metrics">
                  <div className="metric">
                    <span className="metric-value">{creative.ctr?.toFixed(2)}%</span>
                    <span className="metric-label">CTR</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{creative.clicks?.toLocaleString()}</span>
                    <span className="metric-label">Clicks</span>
                  </div>
                </div>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(creative.headline)}
                >
                  {copiedText === creative.headline ? (
                    <CheckCircle size={18} className="copied" />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Length Analysis */}
        <div className="analysis-section">
          <div className="section-header">
            <h2>Performance by Length</h2>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={lengthPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" fontSize={11} width={120} />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="avgCtr" fill="#6366f1" name="Avg CTR %" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="length-breakdown">
            {lengthPerformance.map((item, index) => (
              <div key={index} className="length-item">
                <span className="length-name">{item.name}</span>
                <span className="length-count">{item.count} ads</span>
                <span className="length-ctr">{item.avgCtr}% CTR</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copy Templates */}
      <div className="templates-section">
        <div className="section-header">
          <h2>
            <Sparkles size={20} />
            Copy Templates & Frameworks
          </h2>
        </div>
        <div className="templates-grid">
          {copyTemplates.map((category, index) => (
            <div key={index} className="template-card">
              <h3>{category.category}</h3>
              <div className="template-examples">
                {category.examples.map((example, i) => (
                  <div key={i} className="template-example">
                    <span>{example}</span>
                    <button
                      className="copy-btn-small"
                      onClick={() => copyToClipboard(example)}
                    >
                      {copiedText === example ? (
                        <CheckCircle size={14} className="copied" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Writing Tips */}
      <div className="tips-section">
        <h2>Copywriting Best Practices</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <Target size={24} />
            <h4>Speak to One Person</h4>
            <p>Write as if talking to a single ideal customer, not a crowd</p>
          </div>
          <div className="tip-card">
            <TrendingUp size={24} />
            <h4>Lead with Benefits</h4>
            <p>Focus on transformation and outcomes, not features</p>
          </div>
          <div className="tip-card">
            <Sparkles size={24} />
            <h4>Use Power Words</h4>
            <p>Free, New, Proven, Easy, Guaranteed, Limited, Secret</p>
          </div>
          <div className="tip-card">
            <FileText size={24} />
            <h4>Keep it Simple</h4>
            <p>Use short sentences and everyday language</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCopy;
