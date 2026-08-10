import React from 'react';

export const SkeletonText = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}></div>
);

export const SkeletonImage = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${className}`}></div>
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 p-6 ${className}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-3 w-3/4">
        <SkeletonText className="h-4 w-1/2" />
        <SkeletonText className="h-8 w-1/3" />
      </div>
      <SkeletonImage className="w-12 h-12 rounded-full" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="w-full">
    <div className="overflow-x-auto border border-gray-200 dark:border-gray-800">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            {[...Array(columns)].map((_, idx) => (
              <th key={idx} className="px-4 py-3">
                <SkeletonText className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1a1d24]">
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(columns)].map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-4">
                  <SkeletonText className={`h-4 ${colIndex === 0 ? 'w-8' : 'w-3/4'}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const SkeletonForm = () => (
  <div className="w-full bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 p-6 space-y-6">
    <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
      <SkeletonText className="h-6 w-1/4" />
      <div className="flex gap-3">
        <SkeletonText className="h-9 w-24 rounded-lg" />
        <SkeletonText className="h-9 w-24 rounded-lg" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <SkeletonText className="h-4 w-24" />
          <SkeletonText className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <SkeletonText className="h-4 w-24" />
          <SkeletonText className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <SkeletonText className="h-4 w-24" />
          <SkeletonText className="h-24 w-full" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <SkeletonText className="h-4 w-24" />
          <SkeletonText className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <SkeletonText className="h-4 w-24" />
          <SkeletonText className="h-10 w-full" />
        </div>
        <div className="p-4 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <SkeletonText className="h-4 w-32 mb-4" />
          <div className="flex gap-4">
            <SkeletonImage className="h-20 w-20 rounded" />
            <SkeletonImage className="h-20 w-20 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
