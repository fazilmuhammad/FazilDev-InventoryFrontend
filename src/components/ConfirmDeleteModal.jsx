import React from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1a1d24] p-6 shadow-xl w-full max-w-sm animate-fade-in-up border border-gray-200 dark:border-gray-800 transition-colors">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {title || 'Confirm Delete'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
