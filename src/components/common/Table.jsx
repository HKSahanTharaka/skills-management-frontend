import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, MoreVertical } from 'lucide-react';
import { Skeleton } from './Loading';

const Table = ({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
  sortable = true,
  selectable = false,
  onSelectionChange,
  actions,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState(new Set());

  const handleSort = (key) => {
    if (!sortable) return;

    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleRowSelection = (id) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
    onSelectionChange?.(Array.from(newSelection));
  };

  const toggleAllRows = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const allIds = new Set(data.map((row) => row.id));
      setSelectedRows(allIds);
      onSelectionChange?.(Array.from(allIds));
    }
  };

  const getSortIcon = (columnKey) => {
    if (!sortable) return null;

    if (sortConfig.key === columnKey) {
      return sortConfig.direction === 'asc' ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      );
    }
    return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} variant="card" className="h-16" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
        <p className="text-gray-500 dark:text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
        <thead className="bg-gray-50 dark:bg-slate-900">
          <tr>
            {selectable && (
              <th className="px-6 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedRows.size === data.length}
                  onChange={toggleAllRows}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider
                  ${sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800' : ''}
                `}
                onClick={() => column.sortable !== false && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable !== false && getSortIcon(column.key)}
                </div>
              </th>
            ))}
            {actions && <th className="px-6 py-3 w-16"></th>}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
          {sortedData.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={`
                transition-colors
                ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700' : ''}
                ${selectedRows.has(row.id) ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
              `}
              onClick={() => onRowClick?.(row)}
            >
              {selectable && (
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleRowSelection(row.id);
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </td>
              )}
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      actions.onClick(row);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

