import React from 'react';
import { X, Star, CheckCircle2, AlertCircle, Calendar, Hash, Tag, Edit3, Trash2 } from 'lucide-react';

const ProductDetailModal = ({ product, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen || !product) return null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image */}
          <div className="relative bg-slate-100 min-h-[260px] md:min-h-[380px] flex items-center justify-center overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
                {product.category}
              </span>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Brand and SKU */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold uppercase tracking-wider text-slate-500">
                  {product.brand || 'Generic Brand'}
                </span>
                <span className="font-mono text-slate-400 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  {product.sku || 'N/A'}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-3">
                {product.name}
              </h2>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating || 4.5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {Number(product.rating || 4.5).toFixed(1)}
                </span>
                <span className="text-xs text-slate-400">
                  ({product.reviewsCount || 0} reviews)
                </span>
              </div>

              {/* Price & Stock highlight box */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Unit Price</span>
                  <span className="text-2xl font-black text-slate-900">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
                <div>
                  {isOutOfStock ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Out of Stock
                    </div>
                  ) : (
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        isLowStock
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {product.stock} in stock
                    </div>
                  )}
                </div>
              </div>

              {/* Full Description */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Description
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-0.8 bg-slate-100 text-slate-600 rounded-md text-xs font-medium"
                      >
                        <Tag className="w-3 h-3 text-slate-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  Added on {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onEdit(product);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold text-sm rounded-xl transition-colors border border-sky-200"
              >
                <Edit3 className="w-4 h-4" />
                Edit Product
              </button>
              <button
                onClick={() => {
                  onClose();
                  onDelete(product);
                }}
                className="inline-flex items-center justify-center p-2.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
                title="Delete product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
