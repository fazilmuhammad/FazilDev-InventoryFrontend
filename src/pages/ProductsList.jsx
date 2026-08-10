import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, FileSpreadsheet, FileText, Image as ImageIcon } from 'lucide-react';
import Table from '../components/Table';
import { getProducts, getCategories, downloadReport, deleteProduct, adjustStock } from '../services/api';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import AdjustStockModal from '../components/AdjustStockModal';
import { SkeletonTable } from '../components/Skeleton';
import toast from 'react-hot-toast';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Adjust Stock Modal State
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [productToAdjust, setProductToAdjust] = useState(null);

  const handleDelete = (id) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleAdjustClick = (product) => {
    setProductToAdjust(product);
    setStockModalOpen(true);
  };

  const confirmAdjustStock = async (adjustment) => {
    if (!productToAdjust) return;
    try {
      await adjustStock(productToAdjust.id, adjustment);
      toast.success('Stock adjusted successfully');
      setStockModalOpen(false);
      setProductToAdjust(null);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to adjust stock');
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete);
      toast.success('Product deleted successfully');
      setDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete product');
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Data
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, debouncedSearch, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await getProducts({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        category_id: selectedCategory || undefined
      });
      setProducts(res.data);
      setPagination(res.meta);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (type) => {
    downloadReport(type);
    toast.success(`Exporting to ${type.toUpperCase()}...`);
  };

  const columns = [
    {
      header: 'No',
      cell: (_, rowIndex) => (
        <span className="text-gray-500 font-medium whitespace-nowrap">
          {(pagination.page - 1) * pagination.limit + rowIndex + 1}.
        </span>
      )
    },
    {
      header: 'Product',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
            {row.mainImage ? (
              <img src={`http://localhost:3000${row.mainImage}`} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="text-gray-400" />
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{row.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{row.productCode}</div>
          </div>
        </div>
      )
    },
    {
      header: 'SKU',
      accessorKey: 'sku',
      cell: (row) => (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{row.sku || '-'}</span>
      )
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
          {row.category?.name}
        </span>
      )
    },
    {
      header: 'Stock',
      accessorKey: 'stock',
      cell: (row) => (
        <span className="font-medium text-gray-700 dark:text-gray-300">{row.stock}</span>
      )
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/products/detail/${row.id}`}
            className="text-xs px-3 py-1.5 font-medium text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-900/20 hover:bg-primary/20 dark:hover:bg-blue-900/40 transition-colors"
          >
            View
          </Link>
          <button
            onClick={() => handleAdjustClick(row)}
            className="text-xs px-3 py-1.5 font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Adjust Stock
          </button>
          <button
            onClick={() => handleDelete(row.id)}
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => downloadReport('excel', 'products_report.xlsx')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors text-sm rounded-none">
            <FileSpreadsheet size={16} />
            Excel
          </button>
          <button onClick={() => downloadReport('pdf', 'products_report.pdf')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors text-sm rounded-none">
            <FileText size={16} />
            PDF
          </button>
          <Link
            to="/products/new"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white hover:bg-primary-hover shadow-sm transition-all text-sm rounded-none"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      </div>

      <div className="flex flex-row items-center gap-2 mb-6 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 dark:bg-[#1a1d24] dark:text-white rounded-none focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-blue-400 focus:border-primary transition-all"
          />
        </div>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => {
              const el = document.getElementById('category-dropdown');
              if (el) el.classList.toggle('hidden');
            }}
            onBlur={() => {
              setTimeout(() => {
                const el = document.getElementById('category-dropdown');
                if (el) el.classList.add('hidden');
              }, 150);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 pr-7 text-sm border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-blue-400 transition-all bg-white dark:bg-[#1a1d24] text-gray-700 dark:text-gray-300 w-[180px] text-left relative"
          >
            <Filter size={16} className="text-gray-400 dark:text-gray-500" />
            <span className="truncate flex-1">
              {selectedCategory
                ? categories.find(c => c.id.toString() === selectedCategory.toString())?.name || 'All Categories'
                : 'All Categories'}
            </span>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </button>

          <div id="category-dropdown" className="hidden absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg top-full left-0 max-h-60 overflow-y-auto">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => {
                setSelectedCategory('');
                setPagination(prev => ({ ...prev, page: 1 }));
                document.getElementById('category-dropdown').classList.add('hidden');
              }}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-50 dark:border-gray-700"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setPagination(prev => ({ ...prev, page: 1 }));
                  document.getElementById('category-dropdown').classList.add('hidden');
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
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
            className="flex items-center gap-1.5 px-2.5 py-1.5 pr-7 text-sm border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-blue-400 transition-all bg-white dark:bg-[#1a1d24] font-medium text-gray-700 dark:text-gray-300 w-[60px] text-left relative"
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

      <div className="w-full">
        {isLoading ? (
          <SkeletonTable rows={10} columns={5} />
        ) : (
          <Table
            columns={columns}
            data={products}
            pagination={pagination}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          />
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />

      <AdjustStockModal
        isOpen={stockModalOpen}
        onClose={() => {
          setStockModalOpen(false);
          setProductToAdjust(null);
        }}
        onConfirm={confirmAdjustStock}
        currentStock={productToAdjust?.stock || 0}
      />
    </div>
  );
};

export default ProductsList;
