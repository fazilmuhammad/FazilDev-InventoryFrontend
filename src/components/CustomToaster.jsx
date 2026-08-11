import React from 'react';
import { Toaster, resolveValue, toast } from 'react-hot-toast';
import { DangerCircleLinear, CheckCircleLinear, InfoCircleLinear, CloseCircleLinear } from 'solar-icon-set';

const CustomToaster = () => {
  return (
    <Toaster position="bottom-right">
      {(t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-sm w-full bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 shadow-lg pointer-events-auto flex flex-col p-4 transition-all`}
        >
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              {t.type === 'error' ? (
                <DangerCircleLinear color="#ef4444" size={20} />
              ) : t.type === 'success' ? (
                <CheckCircleLinear color="#22c55e" size={20} />
              ) : (
                <InfoCircleLinear color="#eab308" size={20} />
              )}
              <h3 className={`text-sm font-bold uppercase tracking-wider ${t.type === 'error' ? 'text-red-600 dark:text-red-400' : t.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                {t.type === 'error' ? 'Error' : t.type === 'success' ? 'Success' : 'Notification'}
              </h3>
            </div>
            <button 
              onClick={() => toast.dismiss(t.id)} 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <CloseCircleLinear size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 pl-7 leading-relaxed">
            {resolveValue(t.message, t)}
          </p>
        </div>
      )}
    </Toaster>
  );
};

export default CustomToaster;
