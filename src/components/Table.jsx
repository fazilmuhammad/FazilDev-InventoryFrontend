import React from 'react';
import { AltArrowLeftLinear, AltArrowRightLinear } from 'solar-icon-set';

const Table = ({ columns, data, pagination, onPageChange }) => {
  return (
    <div className="w-full">
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1a1d24]">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-4 text-sm text-gray-900 dark:text-gray-200 align-middle">
                      {col.cell ? col.cell(row, rowIndex) : row[col.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1a1d24]">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1a1d24] border border-t-0 border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing page <span className="font-medium text-gray-900 dark:text-white">{pagination.page}</span> of{' '}
            <span className="font-medium text-gray-900 dark:text-white">{pagination.totalPages}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <AltArrowLeftLinear size={18} />
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 flex items-center justify-center text-sm font-medium transition-colors
                  ${pagination.page === page 
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <AltArrowRightLinear size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
