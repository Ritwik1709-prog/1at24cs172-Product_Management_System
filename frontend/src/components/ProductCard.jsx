import React from 'react';
import { Star, Eye, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

const ProductCard = ({ product, onViewDetails, onEdit, onDelete }) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Image Container with Badges */}
      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide rounded-full bg-white/90 backdrop-blur-md text-slate-800 shadow-xs border border-white/60">
            {product.category}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.8 text-[11px] font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
              <AlertCircle className="w-3 h-3" />
              Out of stock
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.8 text-[11px] font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
              Only {product.stock} left
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.8 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3 h-3" />
              In stock
            </span>
          )}
        </div>

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-semibold shadow-md hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & SKU */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium text-slate-500 uppercase tracking-wider text-[10px]">
              {product.brand || 'Generic'}
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              {product.sku || 'N/A'}
            </span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onViewDetails(product)}
            className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 hover:text-sky-600 transition-colors cursor-pointer mb-1.5"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-slate-800">
              {Number(product.rating || 4.5).toFixed(1)}
            </span>
            {product.reviewsCount !== undefined && (
              <span className="text-xs text-slate-400">
                ({product.reviewsCount})
              </span>
            )}
          </div>

          {/* Price & Action Row */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block -mb-0.5">Price</span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                ${Number(product.price).toFixed(2)}
              </span>
            </div>

            {/* Action buttons: Edit & Delete */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(product)}
                title="Edit product"
                className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(product)}
                title="Delete product"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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

export default ProductCard;
