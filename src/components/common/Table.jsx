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
  mobileKeyColumn = null,
  mobileVisibleColumns = [],
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

  const mobileColumns = mobileVisibleColumns.length > 0
    ? columns.filter(col => mobileVisibleColumns.includes(col.key))
    : columns.slice(0, 3);

  const keyColumn = mobileKeyColumn || columns[0]?.key;

  const MobileCardView = () => (
    <div className="md:hidden space-y-3">
      {sortedData.map((row, rowIndex) => (
        <div
          key={row.id || rowIndex}
          className={`
            bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm
            transition-all duration-200
            ${onRowClick ? 'cursor-pointer hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600' : ''}
            ${selectedRows.has(row.id) ? 'ring-2 ring-primary-500 border-primary-500' : ''}
          `}
          onClick={() => onRowClick?.(row)}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {selectable && (
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleRowSelection(row.id);
                    }}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  {keyColumn && (
                    <div className="font-semibold text-gray-900 dark:text-slate-100 text-base mb-1 break-words">
                      {columns.find(col => col.key === keyColumn)?.render
                        ? columns.find(col => col.key === keyColumn).render(row[keyColumn], row)
                        : row[keyColumn]}
                    </div>
                  )}
                </div>
              </div>
              {actions && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.onClick(row);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors p-2 -mr-2 flex-shrink-0"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              {mobileColumns
                .filter(col => col.key !== keyColumn)
                .map((column) => (
                  <div key={column.key} className="flex items-start justify-between text-sm gap-2">
                    <span className="text-gray-500 dark:text-slate-400 font-medium flex-shrink-0">
                      {column.label}:
                    </span>
                    <span className="text-gray-900 dark:text-slate-100 text-right break-words">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const DesktopTableView = () => (
    <div className="hidden md:block overflow-x-auto bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
        <thead className="bg-gray-50 dark:bg-slate-900">
          <tr>
            {selectable && (
              <th key="select-header" className="px-6 py-3 w-12">
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
            {actions && <th key="actions-header" className="px-6 py-3 w-16"></th>}
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
                <td key="select-cell" className="px-6 py-4">
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
                <td key="actions-cell" className="px-6 py-4 text-right">
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

  return (
    <>
      <MobileCardView />
      <DesktopTableView />
    </>
  );
};

export default Table;
