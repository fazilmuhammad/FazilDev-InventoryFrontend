import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { BoxLinear, TagLinear, DollarLinear, DangerTriangleLinear, ClockCircleLinear, ArrowRightLinear } from 'solar-icon-set';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { SkeletonCard, SkeletonTable } from '../components/Skeleton';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStockAlerts: [],
    recentProducts: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Low Stock Alerts</h3>
            </div>
            <SkeletonTable rows={5} columns={3} />
          </div>
          <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recently Added</h3>
            </div>
            <SkeletonTable rows={5} columns={3} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#1a1d24] p-6 border border-gray-200 dark:border-gray-800 flex items-center justify-between transition-colors">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Products</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</h3>
          </div>
          <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-full text-primary dark:text-primary-hover">
            <BoxLinear size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1d24] p-6 border border-gray-200 dark:border-gray-800 flex items-center justify-between transition-colors">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Categories</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCategories}</h3>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400">
            <TagLinear size={24} />
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 transition-colors">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">

              Low Stock Alerts
            </h3>
            <span className="text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full">
              {stats.lowStockAlerts.length} items
            </span>
          </div>

          <div className="overflow-x-auto">
            {stats.lowStockAlerts.length === 0 ? (
              <p className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">All products have sufficient stock.</p>
            ) : (
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-3 font-semibold border-b border-gray-200 dark:border-gray-800">Product</th>
                    <th className="px-5 py-3 font-semibold border-b border-gray-200 dark:border-gray-800 text-right">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {stats.lowStockAlerts.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        <Link to={`/products/detail/${product.id}`} className="hover:text-primary dark:hover:text-primary-hover">
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-sm font-bold text-red-600 dark:text-red-400 text-right">{product.totalStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recently Added */}
        <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 transition-colors">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Recently Added
            </h3>
            <Link to="/products" className="text-sm font-medium text-primary hover:text-primary-hover dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
              View All <ArrowRightLinear size={16} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {stats.recentProducts.length === 0 ? (
              <p className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">No products added yet.</p>
            ) : (
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-3 font-semibold border-b border-gray-200 dark:border-gray-800">Product</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {stats.recentProducts.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                            {product.mainImage ? (
                              <img src={`http://localhost:3000${product.mainImage}`} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <BoxLinear size={16} className="text-gray-400 dark:text-gray-500" />
                            )}
                          </div>
                          <div>
                            <Link to={`/products/detail/${product.id}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary-hover line-clamp-1">
                              {product.name}
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.category?.name || 'Uncategorized'}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
