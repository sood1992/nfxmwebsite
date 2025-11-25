import React, { useState } from 'react';
import { X, Plus, GripVertical } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './MetricPills.css';

const MetricPills = () => {
  const { selectedMetrics, removeMetric, addMetric, availableMetrics, reorderMetrics } = useApp();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const getMetricLabel = (metricId) => {
    const metric = availableMetrics.find(m => m.id === metricId);
    return metric ? metric.label : metricId;
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newMetrics = [...selectedMetrics];
    const [removed] = newMetrics.splice(draggedIndex, 1);
    newMetrics.splice(index, 0, removed);
    reorderMetrics(newMetrics);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const unselectedMetrics = availableMetrics.filter(
    m => !selectedMetrics.includes(m.id)
  );

  return (
    <div className="metric-pills-container">
      <div className="metric-pills">
        {selectedMetrics.map((metricId, index) => (
          <div
            key={metricId}
            className={`metric-pill active ${draggedIndex === index ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
          >
            <GripVertical size={14} className="drag-handle" />
            <span className="pill-number">{index + 1}</span>
            <span className="pill-label">{getMetricLabel(metricId)}</span>
            <button
              className="pill-remove"
              onClick={() => removeMetric(metricId)}
              disabled={selectedMetrics.length <= 1}
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Add Metric Button */}
        <div className="add-metric-container">
          <button
            className="add-metric-btn"
            onClick={() => setShowAddMenu(!showAddMenu)}
          >
            <Plus size={16} />
            <span>Add Metric</span>
          </button>

          {showAddMenu && (
            <div className="add-metric-menu">
              <div className="menu-header">
                <span>Add Metric</span>
              </div>
              <div className="menu-sections">
                {['cost', 'reach', 'engagement', 'creative', 'conversion'].map(category => {
                  const categoryMetrics = unselectedMetrics.filter(m => m.category === category);
                  if (categoryMetrics.length === 0) return null;

                  return (
                    <div key={category} className="menu-section">
                      <span className="section-title">{category}</span>
                      {categoryMetrics.map(metric => (
                        <button
                          key={metric.id}
                          className="menu-item"
                          onClick={() => {
                            addMetric(metric.id);
                            setShowAddMenu(false);
                          }}
                        >
                          {metric.label}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricPills;
