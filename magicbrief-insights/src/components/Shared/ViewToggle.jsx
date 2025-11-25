import React from 'react';
import { LayoutGrid, List, BarChart3, Table2 } from 'lucide-react';
import './ViewToggle.css';

const ViewToggle = ({ view, onChange, options = ['card', 'chart', 'table'] }) => {
  const icons = {
    card: LayoutGrid,
    chart: BarChart3,
    table: Table2,
    list: List,
  };

  const labels = {
    card: 'Card View',
    chart: 'Chart View',
    table: 'Table View',
    list: 'List View',
  };

  return (
    <div className="view-toggle">
      {options.map((option) => {
        const Icon = icons[option];
        return (
          <button
            key={option}
            className={`view-toggle-btn ${view === option ? 'active' : ''}`}
            onClick={() => onChange(option)}
            title={labels[option]}
          >
            <Icon size={18} />
          </button>
        );
      })}
    </div>
  );
};

export default ViewToggle;
