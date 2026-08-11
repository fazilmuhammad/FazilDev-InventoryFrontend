import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftLinear, AltArrowLeftLinear, AltArrowRightLinear, EyeLinear, TrashBinTrashLinear } from 'solar-icon-set';
import Barcode from 'react-barcode';
import { getProductById, deleteProduct, adjustStock } from '../services/api';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import AdjustStockModal from '../components/AdjustStockModal';
import { SkeletonText, SkeletonImage } from '../components/Skeleton';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [fullscreenPreview, setFullscreenPreview] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully');
      setDeleteModalOpen(false);
      navigate('/products');
    } catch (error) {
      toast.error('Failed to delete product');
      setDeleteModalOpen(false);
    }
  };

  const handleAdjustStock = async (adjustment) => {
    try {
      await adjustStock(id, adjustment);
      toast.success('Stock adjusted successfully');
      setStockModalOpen(false);
      loadProduct(); // Refresh data
    } catch (error) {
      toast.error('Failed to adjust stock');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-[#1a1d24] p-6 border border-gray-200 dark:border-gray-800 w-full flex justify-between transition-colors">
          <SkeletonText className="w-1/4 h-8" />
          <SkeletonText className="w-32 h-8" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-4 bg-white dark:bg-[#1a1d24] p-4 border border-gray-200 dark:border-gray-800 flex flex-col items-center transition-colors">
            <SkeletonImage className="w-full h-80" />
            <div className="flex gap-2 mt-4">
              <SkeletonImage className="w-16 h-16" />
              <SkeletonImage className="w-16 h-16" />
            </div>
          </div>
          <div className="lg:col-span-8 bg-white dark:bg-[#1a1d24] p-6 md:p-8 border border-gray-200 dark:border-gray-800 flex flex-col justify-center flex-1 transition-colors">
            <SkeletonText className="w-full h-48 mb-6" />
            <SkeletonText className="w-3/4 h-32" />
          </div>
        </div>
      </div>
    );
  }
  if (!product) return <div className="p-8 text-center text-red-500">Product not found</div>;

  let allImages = [];
  if (product.mainImage) allImages.push(product.mainImage);
  if (Array.isArray(product.additionalImages)) {
    allImages = [...allImages, ...product.additionalImages];
  }

  const stock = product.stock || 0;

  return (
    <div className="space-y-6">
      {/* Header Info Card */}
      <div className="bg-white dark:bg-[#1a1d24] p-6 border border-gray-200 dark:border-gray-800 w-full transition-colors">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate('/products')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors rounded-md mt-1.5"
              title="Back to Products"
            >
              <ArrowLeftLinear size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{product.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <Link
              to={`/products/edit/${product.id}`}
              className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm"
            >
              Edit
            </Link>
            <button
              onClick={handleDeleteClick}
              className="px-4 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm"
            >
              Delete
            </button>
            <button
              onClick={() => setStockModalOpen(true)}
              className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors text-sm"
            >
              Adjust Stock
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: items-stretch automatically matches heights of items in the same row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* ROW 1 */}
        {/* Image Viewer */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1a1d24] p-4 border border-gray-200 dark:border-gray-800 flex flex-col items-center transition-colors">
          <div className="w-full flex-1 min-h-[250px] bg-gray-50 dark:bg-gray-800/50 overflow-hidden mb-4 flex items-center justify-center relative group">
            {allImages.length > 0 ? (
              <>
                <img
                  src={`http://localhost:3000${allImages[currentImageIdx]}`}
                  alt={product.name}
                  className="w-full h-full object-contain p-2 absolute inset-0"
                />
                <div
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 cursor-pointer"
                  onClick={() => setFullscreenPreview(true)}
                  title="Preview"
                >
                  <EyeLinear className="text-white" size={32} />
                </div>
              </>
            ) : (
              <span className="text-gray-400 dark:text-gray-500">No Image</span>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex items-center gap-3 mt-auto pt-2">
              <button
                onClick={() => setCurrentImageIdx(prev => (prev > 0 ? prev - 1 : prev))}
                className="p-1 hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <AltArrowLeftLinear size={18} />
              </button>

              <div className="flex gap-2">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIdx(idx)}
                    className={`w-2 h-2 transition-colors ${idx === currentImageIdx ? 'bg-gray-800' : 'bg-gray-300'}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentImageIdx(prev => (prev < allImages.length - 1 ? prev + 1 : prev))}
                className="p-1 hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <AltArrowRightLinear size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Details Grid Card */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1a1d24] p-6 md:p-8 border border-gray-200 dark:border-gray-800 flex flex-col justify-center transition-colors">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 mb-6 uppercase tracking-wider">Inventory & Sourcing Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Current Stock</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{stock} Units</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Category</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{product.category?.name || 'Uncategorized'}</p>
            </div>
          </div>
        </div>


        {/* ROW 2 */}
        {/* Barcode block */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1a1d24] p-6 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center transition-colors">
          {product.productCode ? (
            <>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Product Barcode</h3>
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-center">
                <div className="scale-90 origin-center">
                  <Barcode
                    value={product.productCode}
                    format="CODE128"
                    width={1.5}
                    height={50}
                    fontSize={14}
                    background="#ffffff"
                    lineColor="#000000"
                  />
                </div>
              </div>
            </>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">No Barcode</span>
          )}
        </div>


        {/* System Info Card */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1a1d24] p-6 md:p-8 border border-gray-200 dark:border-gray-800 flex flex-col justify-center transition-colors">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 mb-6 uppercase tracking-wider">System Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Created At</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{new Date(product.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Last Updated</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{new Date(product.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

      </div>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />

      <AdjustStockModal
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        onConfirm={handleAdjustStock}
        currentStock={stock}
      />

      {/* Fullscreen Image Preview Modal */}
      {fullscreenPreview && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setFullscreenPreview(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all z-10"
            onClick={() => setFullscreenPreview(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          {allImages.length > 1 && currentImageIdx > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIdx(prev => prev - 1);
              }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all z-10"
            >
              <AltArrowLeftLinear size={32} />
            </button>
          )}

          <img
            src={`http://localhost:3000${allImages[currentImageIdx]}`}
            alt="Fullscreen Preview"
            className="max-w-full max-h-full object-contain shadow-2xl rounded-sm select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {allImages.length > 1 && currentImageIdx < allImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIdx(prev => prev + 1);
              }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all z-10"
            >
              <AltArrowRightLinear size={32} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
