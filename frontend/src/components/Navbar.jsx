import React from 'react';
import { Package, Plus, Sparkles, RefreshCw } from 'lucide-react';

const Navbar = ({ onOpenAddModal, onSeedData, isSeeding, totalProducts }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Stock<span className="text-sky-600">Hub</span>
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  MERN
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Product Inventory & Catalog Management
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onSeedData}
              disabled={isSeeding}
              title="Reset catalog with 12 realistic sample products"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSeeding ? (
                <RefreshCw className="w-4 h-4 animate-spin text-sky-600" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-500" />
              )}
              <span className="hidden sm:inline">Reset Sample Data</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-sm hover:shadow-md hover:shadow-sky-600/20 transition-all duration-150"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
