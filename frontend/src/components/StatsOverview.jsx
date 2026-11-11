import React from 'react';
import { Package, DollarSign, Tag, AlertTriangle } from 'lucide-react';

const StatsOverview = ({ stats, loading }) => {
  if (loading && !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 animate-pulse h-24">
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
            <div className="h-7 bg-slate-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-100',
      unit: 'items'
    },
    {
      label: 'Inventory Value',
      value: stats?.totalInventoryValue ? `$${Number(stats.totalInventoryValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      unit: 'stock value'
    },
    {
      label: 'Average Price',
      value: stats?.avgPrice ? `$${Number(stats.avgPrice).toFixed(2)}` : '$0.00',
      icon: Tag,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
      unit: 'per item'
    },
    {
      label: 'Inventory Alert',
      value: stats?.lowStockCount !== undefined ? `${stats.lowStockCount} Low / ${stats.outOfStockCount || 0} Out` : '0',
      icon: AlertTriangle,
      color: stats?.lowStockCount > 0 || stats?.outOfStockCount > 0 ? 'text-amber-600' : 'text-slate-600',
      bgColor: stats?.lowStockCount > 0 || stats?.outOfStockCount > 0 ? 'bg-amber-50' : 'bg-slate-50',
      borderColor: stats?.lowStockCount > 0 || stats?.outOfStockCount > 0 ? 'border-amber-100' : 'border-slate-100',
      unit: 'needs attention'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                {card.label}
              </span>
              <div className={`p-2 rounded-lg ${card.bgColor} ${card.color}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
                {card.value}
              </div>
            </div>
            <span className="text-[11px] text-slate-400 capitalize">{card.unit}</span>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;
