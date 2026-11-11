import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' }
];

const SortDropdown = ({ sortBy, onSortChange }) => {
  return (
    <div className="relative inline-flex items-center">
      <div className="relative flex items-center">
        <div className="absolute left-3 pointer-events-none text-slate-400">
          <ArrowUpDown className="w-3.5 h-3.5" />
        </div>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none pl-8 pr-8 py-2.5 bg-white text-xs sm:text-sm font-medium text-slate-700 rounded-xl border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all cursor-pointer shadow-xs"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 pointer-events-none text-slate-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SortDropdown;
