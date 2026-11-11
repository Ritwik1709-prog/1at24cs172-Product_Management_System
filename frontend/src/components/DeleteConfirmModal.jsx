import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, product, isDeleting }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">Delete Product</h3>
        <p className="text-sm text-slate-500 mb-4">
          Are you sure you want to permanently delete{' '}
          <span className="font-semibold text-slate-800">"{product.name}"</span> from MongoDB? This action cannot be undone.
        </p>

        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-6">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-12 h-12 object-cover rounded-lg bg-slate-200"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <div className="truncate">
            <h4 className="text-xs font-semibold text-slate-900 truncate">{product.name}</h4>
            <p className="text-xs text-slate-500">${Number(product.price).toFixed(2)} • {product.category}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Product</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
