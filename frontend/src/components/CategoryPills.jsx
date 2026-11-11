import React from 'react';

const CategoryPills = ({ categories = [], selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.name;
        return (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              isSelected
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <span>{cat.name}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {cat.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryPills;
