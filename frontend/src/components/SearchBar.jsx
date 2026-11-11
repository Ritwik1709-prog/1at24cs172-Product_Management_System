import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ search, onSearchChange, totalResults, isFiltered }) => {
  return (
    <div className="relative flex-1 min-w-[240px]">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products by name, brand, or SKU..."
          className="w-full pl-10 pr-10 py-2.5 bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-xs"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Live search feedback badge */}
      {search && (
        <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5 pl-1">
          <span>Results for <span className="font-semibold text-slate-700">"{search}"</span>:</span>
          <span className="font-medium text-sky-600 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200/50">
            {totalResults} {totalResults === 1 ? 'product' : 'products'}
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
