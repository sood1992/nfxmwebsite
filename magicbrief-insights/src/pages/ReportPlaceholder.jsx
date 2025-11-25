import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  RefreshCw,
  Megaphone,
  Image,
  FileText,
  Monitor,
  Layers,
  Clock,
} from 'lucide-react';
import './ReportPlaceholder.css';

const reportConfig = {
  '/reports/iterate-on-hook': {
    icon: RefreshCw,
    title: 'Iterate on Hook',
    description: 'A/B test and improve your hook performance. Compare different opening frames and identify what captures attention best.',
    features: [
      'Compare hook variations',
      'First frame A/B testing',
      'Hook performance trends',
      'Audience response analysis',
    ],
  },
  '/reports/iterate-on-cta': {
    icon: Megaphone,
    title: 'Iterate on CTA',
    description: 'Optimize your call-to-action elements. Test different CTA placements, copy, and designs to maximize conversions.',
    features: [
      'CTA placement analysis',
      'Copy effectiveness',
      'Button design testing',
      'Conversion optimization',
    ],
  },
  '/reports/static-breakdown': {
    icon: Image,
    title: 'Static Breakdown',
    description: 'Analyze static image ads. Understand visual elements, text overlay effectiveness, and design patterns that work.',
    features: [
      'Visual element analysis',
      'Text overlay effectiveness',
      'Color scheme impact',
      'Design pattern insights',
    ],
  },
  '/reports/top-copy': {
    icon: FileText,
    title: 'Top Copy',
    description: 'Discover your best performing ad copy. Analyze headlines, descriptions, and messaging that resonates with your audience.',
    features: [
      'Headline performance',
      'Description analysis',
      'Emotional triggers',
      'Copy length optimization',
    ],
  },
  '/reports/top-landing-page': {
    icon: Monitor,
    title: 'Top Landing Page',
    description: 'Rank and analyze landing page performance. Identify which pages convert best and why.',
    features: [
      'Conversion rate ranking',
      'Page load analysis',
      'User journey tracking',
      'A/B test results',
    ],
  },
  '/reports/compare-formats': {
    icon: Layers,
    title: 'Compare Formats',
    description: 'Compare performance across different ad formats. Understand which formats work best for your goals.',
    features: [
      'Video vs Image analysis',
      'Carousel performance',
      'Story format insights',
      'Format recommendations',
    ],
  },
};

const ReportPlaceholder = () => {
  const location = useLocation();
  const config = reportConfig[location.pathname] || {
    icon: FileText,
    title: 'Report',
    description: 'This report is coming soon.',
    features: [],
  };

  const Icon = config.icon;

  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        <div className="placeholder-icon">
          <Icon size={48} />
        </div>
        <h1>{config.title}</h1>
        <p className="placeholder-description">{config.description}</p>

        <div className="coming-soon-badge">
          <Clock size={16} />
          Coming Soon
        </div>

        <div className="features-preview">
          <h3>What to expect:</h3>
          <ul>
            {config.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        <button className="notify-btn">
          Notify me when available
        </button>
      </div>
    </div>
  );
};

export default ReportPlaceholder;
