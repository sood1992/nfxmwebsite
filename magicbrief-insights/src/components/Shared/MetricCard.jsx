import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './MetricCard.css';

const MetricCard = ({
  title,
  value,
  currency = '',
  unit = '',
  trend,
  status,
  chartData,
  chartColor = 'var(--primary-color)',
  onClick,
}) => {
  const formatValue = (val) => {
    if (typeof val !== 'number') return val;
    if (val >= 100000) {
      return val.toLocaleString('en-IN');
    }
    if (val >= 1000) {
      return val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return val.toFixed(2);
  };

  const getStatusClass = () => {
    if (!status) return '';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('over') || statusLower.includes('excellent')) return 'status-success';
    if (statusLower.includes('track') || statusLower.includes('good')) return 'status-info';
    if (statusLower.includes('under') || statusLower.includes('poor')) return 'status-warning';
    return '';
  };

  return (
    <div className="metric-card" onClick={onClick}>
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        {trend && (
          <div className={`metric-trend ${trend.direction}`}>
            {trend.direction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{currency}{trend.value}</span>
            {trend.percentage && <span className="trend-percentage">{trend.percentage}</span>}
          </div>
        )}
      </div>

      <div className="metric-value">
        {currency && <span className="currency">{currency}</span>}
        {formatValue(value)}
        {unit && <span className="unit">{unit}</span>}
      </div>

      {status && (
        <div className={`metric-status ${getStatusClass()}`}>
          {status}
        </div>
      )}

      {chartData && chartData.length > 0 && (
        <div className="metric-chart">
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={chartData}>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="chart-tooltip">
                        <span>{payload[0].payload.date}</span>
                        <strong>{currency}{payload[0].value}{unit}</strong>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: chartColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
