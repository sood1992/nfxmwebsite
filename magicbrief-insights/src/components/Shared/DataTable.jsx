import React, { useState } from 'react';
import { ChevronUp, ChevronDown, MoreVertical, Check } from 'lucide-react';
import './DataTable.css';

const DataTable = ({
  data,
  columns,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  sortBy,
  sortOrder,
  onSort,
  currency = '₹',
}) => {
  const [menuOpen, setMenuOpen] = useState(null);

  const formatValue = (value, format) => {
    if (value === null || value === undefined) return '-';

    switch (format) {
      case 'currency':
        return `${currency}${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'number':
        return value.toLocaleString('en-IN');
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'score':
        return value;
      default:
        return value;
    }
  };

  const getScoreClass = (score) => {
    if (score === null || score === undefined) return '';
    if (score >= 80) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'average';
    return 'poor';
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isPartialSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {onSelectRow && (
              <th className="checkbox-cell">
                <button
                  className={`table-checkbox ${isAllSelected ? 'checked' : ''} ${isPartialSelected ? 'partial' : ''}`}
                  onClick={onSelectAll}
                >
                  {(isAllSelected || isPartialSelected) && <Check size={12} />}
                </button>
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${column.sortable ? 'sortable' : ''} ${sortBy === column.key ? 'sorted' : ''}`}
                style={{ width: column.width }}
                onClick={() => column.sortable && onSort && onSort(column.key)}
              >
                <div className="th-content">
                  {column.number && <span className="column-number">{column.number}</span>}
                  <span>{column.label}</span>
                  {column.sortable && (
                    <span className="sort-icons">
                      <ChevronUp
                        size={12}
                        className={sortBy === column.key && sortOrder === 'asc' ? 'active' : ''}
                      />
                      <ChevronDown
                        size={12}
                        className={sortBy === column.key && sortOrder === 'desc' ? 'active' : ''}
                      />
                    </span>
                  )}
                </div>
              </th>
            ))}
            <th className="actions-cell"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id}
              className={selectedRows.includes(row.id) ? 'selected' : ''}
            >
              {onSelectRow && (
                <td className="checkbox-cell">
                  <button
                    className={`table-checkbox ${selectedRows.includes(row.id) ? 'checked' : ''}`}
                    onClick={() => onSelectRow(row.id)}
                  >
                    {selectedRows.includes(row.id) && <Check size={12} />}
                  </button>
                </td>
              )}
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render ? (
                    column.render(row[column.key], row)
                  ) : column.format === 'score' ? (
                    <span className={`score-badge ${getScoreClass(row[column.key])}`}>
                      {formatValue(row[column.key], column.format)}
                    </span>
                  ) : (
                    formatValue(row[column.key], column.format)
                  )}
                </td>
              ))}
              <td className="actions-cell">
                <div className="row-actions">
                  <button
                    className="action-btn"
                    onClick={() => setMenuOpen(menuOpen === row.id ? null : row.id)}
                  >
                    <MoreVertical size={16} />
                  </button>
                  {menuOpen === row.id && (
                    <div className="action-menu">
                      <button onClick={() => { setMenuOpen(null); }}>View Details</button>
                      <button onClick={() => { setMenuOpen(null); }}>Export</button>
                      <button onClick={() => { setMenuOpen(null); }}>Compare</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
