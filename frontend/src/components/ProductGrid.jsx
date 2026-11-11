import React from 'react';
import ProductCard from './ProductCard';
import { PackageSearch, Plus, RotateCcw } from 'lucide-react';

const ProductGrid = ({
  products,
  loading,
  onViewDetails,
  onEdit,
  onDelete,
  onOpenAddModal,
  onResetFilters,
  hasActiveFilters
}) => {
  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse flex flex-col"
          >
            <div className="aspect-4/3 bg-slate-200" />
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="h-3 bg-slate-200 rounded w-1/3 mb-2" />
                <div className="h-5 bg-slate-200 rounded w-4/5 mb-2" />
                <div className="h-3 bg-slate-200 rounded w-full mb-1" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="h-6 bg-slate-200 rounded w-1/4" />
                <div className="h-8 bg-slate-200 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
          <PackageSearch className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">No products found</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          {hasActiveFilters
            ? 'We couldn\'t find any products matching your search or filter criteria. Try adjusting your query or resetting filters.'
            : 'Your product catalog is currently empty. Get started by adding your first product to MongoDB.'}
        </p>

        <div className="flex items-center justify-center gap-3">
          {hasActiveFilters ? (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Filters</span>
            </button>
          ) : (
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Product</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Responsive Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
