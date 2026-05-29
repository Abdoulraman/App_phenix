import React from 'react';

const DataTable = ({ columns, data, onEdit, onDelete, onView }) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row) : row[col.field]}
                </td>
              ))}
              <td>
                {onView && (
                  <button className="icon-btn" onClick={() => onView(row)} title="Voir">👁️</button>
                )}
                {onEdit && (
                  <button className="icon-btn" onClick={() => onEdit(row)} title="Modifier">✏️</button>
                )}
                {onDelete && (
                  <button className="icon-btn" onClick={() => onDelete(row.id)} title="Supprimer">🗑️</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;