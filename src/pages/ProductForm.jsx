import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getCategories, getProductById, createProduct, updateProduct } from '../services/api';
import toast from 'react-hot-toast';
import { UploadLinear, CloseCircleLinear, DisketteLinear, ArrowLeftLinear, GalleryLinear, AddCircleLinear, EyeLinear } from 'solar-icon-set';
import ConfirmActionModal from '../components/ConfirmActionModal';
import { SkeletonForm } from '../components/Skeleton';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm();
  
  const [categories, setCategories] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInit, setIsLoadingInit] = useState(isEdit);
  const [fullscreenPreview, setFullscreenPreview] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState(null);

  useEffect(() => {
    const initForm = async () => {
      await fetchCategories();
      if (isEdit) {
        await fetchProduct();
      }
      setIsLoadingInit(false);
    };
    initForm();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id);
      setValue('name', data.name);
      setValue('categoryId', data.categoryId);
      setValue('stockQuantity', data.stock);

      
      if (data.mainImage) {
        setMainImagePreview(`http://localhost:3000${data.mainImage}`);
      }
      
      if (data.additionalImages && data.additionalImages.length > 0) {
        setGalleryPreviews(data.additionalImages.map(img => `http://localhost:3000${img}`));
      }
    } catch (error) {
      toast.error('Failed to fetch product details');
      navigate('/products');
    }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (galleryFiles.length + files.length > 4) {
      toast.error('Maximum 4 gallery images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 2MB limit`);
        return false;
      }
      return true;
    });

    setGalleryFiles(prev => [...prev, ...validFiles]);
    
    validFiles.forEach(file => {
      setGalleryPreviews(prev => [...prev, URL.createObjectURL(file)]);
    });
  };

  const removeGalleryImage = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    if (!isEdit && !mainImageFile) {
      toast.error('Main image is required');
      return;
    }
    setFormDataToSubmit(data);
    setConfirmModalOpen(true);
  };

  const confirmSubmit = async () => {
    setConfirmModalOpen(false);
    setIsSubmitting(true);
    const data = formDataToSubmit;

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('categoryId', data.categoryId);
      if (!isEdit) {
        formData.append('stockQuantity', data.stockQuantity);
      }

      
      if (mainImageFile) {
        formData.append('main_image', mainImageFile);
      }
      
      galleryFiles.forEach(file => {
        formData.append('additional_images', file);
      });

      if (isEdit) {
        await updateProduct(id, formData);
        toast.success('Product updated successfully');
      } else {
        await createProduct(formData);
        toast.success('Product created successfully');
      }
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
      setFormDataToSubmit(null);
    }
  };

  if (isLoadingInit) {
    return <SkeletonForm />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header Info Card */}
      <div className="bg-white dark:bg-[#1a1d24] p-6 border border-gray-200 dark:border-gray-800 w-full transition-colors">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors rounded-md"
            title="Back to Products"
          >
            <ArrowLeftLinear size={20} />
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
        </div>
      </div>

      <form 
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.error("Form validation errors:", errors);
          toast.error("Please fill all required fields correctly.");
        })} 
        className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-8 transition-colors"
      >
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">Basic Information</h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Product Name *</label>
              <input
                type="text"
                {...register('name', { required: 'Product name is required' })}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                placeholder="e.g. MacBook Pro M2"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Category *</label>
              <input type="hidden" {...register('categoryId', { required: 'Category is required' })} />
              
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('form-category-dropdown');
                    if (el) el.classList.toggle('hidden');
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      const el = document.getElementById('form-category-dropdown');
                      if (el) el.classList.add('hidden');
                    }, 150);
                  }}
                  className="w-full px-3 py-1.5 pr-8 text-sm text-left border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all relative"
                >
                  <span className={watch('categoryId') ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}>
                    {watch('categoryId') 
                      ? categories.find(c => c.id.toString() === watch('categoryId').toString())?.name 
                      : 'Select a category'}
                  </span>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </button>
                
                <div id="form-category-dropdown" className="hidden absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg top-full left-0 max-h-48 overflow-y-auto">
                  {categories.map((cat, idx) => (
                    <button
                      type="button"
                      key={cat.id}
                      className={`w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${idx > 0 ? 'border-t border-gray-50 dark:border-gray-700' : ''}`}
                      onClick={() => {
                        setValue('categoryId', cat.id, { shouldValidate: true });
                        document.getElementById('form-category-dropdown').classList.add('hidden');
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              {errors.categoryId && <p className="text-red-500 text-xs">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Initial Stock *</label>
              <input
                type="number"
                min="0"
                {...register('stockQuantity', { 
                  required: !isEdit ? 'Stock is required' : false,
                  min: { value: 0, message: 'Stock cannot be negative' }
                })}
                disabled={isEdit}
                className={`w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${isEdit ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                placeholder="0"
              />
              {errors.stockQuantity && <p className="text-red-500 text-xs">{errors.stockQuantity.message}</p>}
            </div>




          </div>
          
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">Product Images</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">Main Image (Required) *</label>
              <div className="flex items-start gap-4">
                <div className="w-32 h-32 overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0 flex flex-col items-center justify-center relative group">
                  {mainImagePreview ? (
                    <>
                      <img src={mainImagePreview} alt="Main Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
                        <button 
                          type="button" 
                          onClick={() => setFullscreenPreview(mainImagePreview)} 
                          className="p-1.5 text-white drop-shadow-md transition-colors hover:scale-110" 
                          title="Preview"
                        >
                          <EyeLinear color="white" size={18} />
                        </button>
                        <div className="relative p-1.5 text-white drop-shadow-md transition-colors cursor-pointer hover:scale-110" title="Replace">
                          <UploadLinear color="white" size={18} />
                          <input 
                            type="file" 
                            accept="image/jpeg, image/png, image/webp"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleMainImageChange}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <GalleryLinear className="mx-auto mb-1 opacity-50" size={24} />
                        <span className="text-xs">Upload</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/jpeg, image/png, image/webp"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handleMainImageChange}
                      />
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <p>Upload a high-quality image of the product.</p>
                  <p className="mt-1">Format: JPEG, PNG, WebP.</p>
                  <p>Max size: 2MB.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">Gallery Images (Optional, Max 4)</label>
              <div className="flex flex-wrap gap-3">
                {galleryPreviews.map((preview, idx) => (
                  <div key={idx} className="w-20 h-20 overflow-hidden border border-gray-200 dark:border-gray-700 relative group">
                    <img src={preview} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        type="button"
                        onClick={() => setFullscreenPreview(preview)}
                        className="p-1 text-white drop-shadow-md hover:scale-110 transition-transform"
                        title="Preview"
                      >
                        <EyeLinear color="white" size={14} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="p-1 text-white drop-shadow-md hover:scale-110 transition-transform"
                        title="Remove"
                      >
                        <CloseCircleLinear color="white" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {galleryPreviews.length < 4 && (
                  <div className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center relative hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <AddCircleLinear className="text-gray-400 dark:text-gray-500" size={20} />
                    <input 
                      type="file" 
                      multiple
                      accept="image/jpeg, image/png, image/webp"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleGalleryChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-6 border-t border-gray-200 dark:border-gray-800">
          <button 
            type="button" 
            onClick={() => navigate('/products')}
            className="px-4 py-1.5 text-sm font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors rounded-none"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover shadow-sm transition-all disabled:opacity-70 rounded-none"
          >
            <DisketteLinear size={16} />
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>

      <ConfirmActionModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmSubmit}
        title={isEdit ? "Update Product" : "Create Product"}
        message={isEdit 
          ? "Are you sure you want to save the changes made to this product?" 
          : "Are you sure you want to create this new product?"}
        confirmText={isEdit ? "Save Changes" : "Create Product"}
        confirmColorClass="bg-gray-900 hover:bg-black text-white"
      />

      {/* Fullscreen Image Preview Modal */}
      {fullscreenPreview && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setFullscreenPreview(null)}
        >
          <button 
            type="button"
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all"
            onClick={() => setFullscreenPreview(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <img 
            src={fullscreenPreview} 
            alt="Fullscreen Preview" 
            className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ProductForm;
