import React from 'react';
import './ScoreCard.css';

const ScoreCard = ({ title, score, description, benchmark = 70 }) => {
  const getScoreClass = () => {
    if (score === null || score === undefined) return 'na';
    if (score >= 80) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'average';
    return 'poor';
  };

  const getScoreLabel = () => {
    const scoreClass = getScoreClass();
    switch (scoreClass) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'average': return 'Average';
      case 'poor': return 'Needs Improvement';
      default: return 'N/A';
    }
  };

  return (
    <div className="score-card">
      <div className="score-header">
        <span className="score-title">{title}</span>
      </div>
      <div className={`score-value ${getScoreClass()}`}>
        {score !== null && score !== undefined ? score : '-'}
      </div>
      {score !== null && score !== undefined && (
        <div className="score-details">
          <div className="score-bar-container">
            <div className="score-bar-track">
              <div
                className={`score-bar-fill ${getScoreClass()}`}
                style={{ width: `${Math.min(score, 100)}%` }}
              />
              <div
                className="score-benchmark"
                style={{ left: `${benchmark}%` }}
              />
            </div>
          </div>
          <span className={`score-label ${getScoreClass()}`}>{getScoreLabel()}</span>
        </div>
      )}
      {description && <p className="score-description">{description}</p>}
    </div>
  );
};

export default ScoreCard;
