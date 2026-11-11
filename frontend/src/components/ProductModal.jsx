import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image, AlertCircle, Check } from 'lucide-react';

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Books & Stationery',
  'Sports & Outdoors',
  'Toys & Games',
  'Automotive',
  'Health & Wellness',
  'Other'
];

const PRESET_IMAGES = [
  { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Laptop', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80' },
  { label: 'Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80' },
  { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80' },
  { label: 'Coffee Maker', url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80' },
  { label: 'Book', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' }
];

const ProductModal = ({ isOpen, onClose, onSave, productToEdit, isSaving }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '10',
    brand: '',
    sku: '',
    rating: '4.5',
    imageUrl: PRESET_IMAGES[0].url,
    tags: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        description: productToEdit.description || '',
        price: productToEdit.price !== undefined ? productToEdit.price.toString() : '',
        category: productToEdit.category || 'Electronics',
        stock: productToEdit.stock !== undefined ? productToEdit.stock.toString() : '0',
        brand: productToEdit.brand || '',
        sku: productToEdit.sku || '',
        rating: productToEdit.rating !== undefined ? productToEdit.rating.toString() : '4.5',
        imageUrl: productToEdit.imageUrl || PRESET_IMAGES[0].url,
        tags: Array.isArray(productToEdit.tags) ? productToEdit.tags.join(', ') : ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        stock: '15',
        brand: '',
        sku: '',
        rating: '4.5',
        imageUrl: PRESET_IMAGES[0].url,
        tags: ''
      });
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      errs.price = 'Please enter a valid price (>= 0)';
    }
    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock, 10) < 0) {
      errs.stock = 'Please enter a valid stock count (>= 0)';
    }
    if (!formData.category) errs.category = 'Category is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      rating: parseFloat(formData.rating || 4.5),
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : []
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {productToEdit ? 'Edit Product' : 'Add New Product to Catalog'}
            </h3>
            <p className="text-xs text-slate-500">
              {productToEdit
                ? 'Update product details in MongoDB'
                : 'Fill in the details to create a new product in MongoDB'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-700 border border-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
              className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Sony, Apple, Nike"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          {/* Price, Stock, SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.price
                    ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Stock Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="10"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                SKU (optional)
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Auto-generated"
                className="w-full px-3.5 py-2 text-sm uppercase font-mono rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          {/* Image Presets & Custom URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Product Image URL
              </label>
              <span className="text-[11px] text-slate-400">Quick presets below:</span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    formData.imageUrl === preset.url
                      ? 'bg-sky-50 border-sky-300 text-sky-700 font-semibold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 text-xs text-slate-700 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
              {formData.imageUrl && (
                <div className="w-10 h-10 rounded-lg border border-slate-200 overflow-hidden shrink-0 bg-slate-100">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of features, materials, and specifications..."
              className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.description
                  ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="wireless, premium, audio, black"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving to MongoDB...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{productToEdit ? 'Save Changes' : 'Add to MongoDB'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
