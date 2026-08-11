import React, { useState } from 'react';
import { BoxMinimalisticLinear, CloseCircleLinear } from 'solar-icon-set';

const AdjustStockModal = ({ isOpen, onClose, onConfirm, currentStock }) => {
  const [adjustment, setAdjustment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (adjustment !== '' && !isNaN(adjustment)) {
      onConfirm(Number(adjustment));
      setAdjustment('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm px-4">
      <div 
        className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-sm transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-hover">
              <BoxMinimalisticLinear size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Adjust Stock</h3>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Enter the quantity to add or remove. Current stock is <span className="font-bold text-gray-900 dark:text-white">{currentStock}</span>.
            Use a negative number to reduce stock (e.g. -5).
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adjustment Amount
              </label>
              <input
                type="number"
                value={adjustment}
                onChange={(e) => setAdjustment(e.target.value)}
                placeholder="e.g. 10 or -5"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0f1115] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-blue-400 focus:border-primary transition-all"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdjustStockModal;
