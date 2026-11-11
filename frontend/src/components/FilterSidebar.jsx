import React from 'react';
import { Filter, RotateCcw, Check, Sparkles } from 'lucide-react';

const FilterSidebar = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  inStockOnly,
  onStockToggle,
  onResetFilters,
  hasActiveFilters
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
          <Filter className="w-4 h-4 text-sky-600" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs text-sky-600 hover:text-sky-700 font-medium inline-flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
          Category
        </label>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-sky-600' : 'bg-slate-300'
                    }`}
                  />
                  <span className="truncate">{cat.name}</span>
                </div>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
          Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[11px] text-slate-400 mb-1 block">Min Price</span>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={minPrice}
              onChange={(e) => onPriceChange('min', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white"
            />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 mb-1 block">Max Price</span>
            <input
              type="number"
              min="0"
              placeholder="5000"
              value={maxPrice}
              onChange={(e) => onPriceChange('max', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Stock Availability Toggle */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
          Availability
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onStockToggle(e.target.checked)}
            className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
          />
          <span className="text-xs text-slate-700 font-medium">In-Stock Only</span>
        </label>
      </div>
    </div>
  );
};

export default FilterSidebar;
