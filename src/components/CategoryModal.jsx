import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Tag } from 'lucide-react';

const CategoryModal = ({ isOpen, onClose, onSave, defaultValues }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  useEffect(() => {
    if (isOpen) {
      if (defaultValues) {
        reset(defaultValues);
      } else {
        reset({ name: '' });
      }
    }
  }, [isOpen, defaultValues, reset]);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm px-4">
      <div 
        className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-sm transition-colors animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-hover">
                <Tag size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {defaultValues ? 'Edit Category' : 'Add New Category'}
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name', { required: 'Category name is required' })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0f1115] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-blue-400 focus:border-primary transition-all"
                placeholder="e.g. Electronics"
                autoFocus
              />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
              >
                {defaultValues ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
