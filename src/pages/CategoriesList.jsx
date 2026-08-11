import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import Table from '../components/Table';
import CategoryModal from '../components/CategoryModal';
import ConfirmActionModal from '../components/ConfirmActionModal';
import { SkeletonTable } from '../components/Skeleton';
import { AddCircleLinear, MagniferLinear } from 'solar-icon-set';
import toast from 'react-hot-toast';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Pagination States
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1
  });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Delete confirm modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch data
  useEffect(() => {
    fetchCategories();
  }, [debouncedSearch, pagination.page, pagination.limit]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch
      });
      
      // Support both paginated (object) and unpaginated (array) formats
      if (response.data && response.pagination) {
        setCategories(response.data);
        setPagination(prev => ({
          ...prev,
          totalPages: response.pagination.totalPages
        }));
      } else {
        setCategories(response);
      }
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (data) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        toast.success('Category updated successfully');
      } else {
        await createCategory(data);
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(deletingId);
      toast.success('Category deleted successfully');
      setIsDeleteModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
      setIsDeleteModalOpen(false);
    }
  };

  const columns = [
    {
      header: 'No',
      cell: (row, index) => ((pagination.page - 1) * pagination.limit) + index + 1,
    },
    { 
      header: 'Category Name', 
      accessorKey: 'name' 
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEditModal(row)}
            className="text-xs px-3 py-1.5 font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => confirmDelete(row.id)}
            className="text-xs px-3 py-1.5 font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white hover:bg-primary-hover shadow-sm transition-all text-sm rounded-none"
          >
            <AddCircleLinear size={16} />
            Add Category
          </button>
        </div>
      </div>

      <div className="flex flex-row items-center gap-2 mb-6 w-full">
        <div className="relative flex-1 min-w-[120px]">
          <MagniferLinear className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 dark:bg-[#1a1d24] dark:text-white focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-blue-400 focus:border-primary transition-all"
          />
        </div>

        <div className="relative flex-shrink-0">
          <button
            onClick={() => {
              const el = document.getElementById('limit-dropdown');
              if (el) el.classList.toggle('hidden');
            }}
            onBlur={() => {
              setTimeout(() => {
                const el = document.getElementById('limit-dropdown');
                if (el) el.classList.add('hidden');
              }, 150);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 pr-7 text-sm border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-blue-400 transition-all bg-white dark:bg-[#1a1d24] text-gray-700 dark:text-gray-300 w-[60px] text-left relative"
          >
            <span className="truncate">{pagination.limit || 10}</span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </button>

          <div id="limit-dropdown" className="hidden absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg top-full left-0">
            {[5, 10, 25, 50].map(val => (
              <button
                key={val}
                className="w-full text-center px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-b-0"
                onClick={() => {
                  setPagination(prev => ({ ...prev, limit: val, page: 1 }));
                  document.getElementById('limit-dropdown').classList.add('hidden');
                }}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-[#1a1d24] relative overflow-hidden flex flex-col border-none">
        {loading ? (
          <SkeletonTable rows={10} columns={3} />
        ) : (
          <div className="flex-1 overflow-auto">
            <Table 
              columns={columns} 
              data={categories}
              pagination={pagination}
              onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
            />
          </div>
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        defaultValues={editingCategory}
      />

      <ConfirmActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        confirmColorClass="bg-red-600 hover:bg-red-700 text-white"
      />
    </div>
  );
};

export default CategoriesList;
