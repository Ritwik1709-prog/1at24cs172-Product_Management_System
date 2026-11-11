import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import SearchBar from './components/SearchBar';
import SortDropdown from './components/SortDropdown';
import FilterSidebar from './components/FilterSidebar';
import CategoryPills from './components/CategoryPills';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import ProductDetailModal from './components/ProductDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { productApi } from './services/api';
import { Filter, SlidersHorizontal, RefreshCw, AlertCircle } from 'lucide-react';

function App() {
  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt_desc');

  // UI & Loading states
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Debounce search input to avoid overwhelming API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(handler);
  }, [search]);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      Boolean(debouncedSearch.trim()) ||
      selectedCategory !== 'All' ||
      minPrice !== '' ||
      maxPrice !== '' ||
      inStockOnly
    );
  }, [debouncedSearch, selectedCategory, minPrice, maxPrice, inStockOnly]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSortBy('createdAt_desc');
  };

  // Fetch products based on active filters
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setServerError(null);
    try {
      const params = {};
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (minPrice !== '') params.minPrice = minPrice;
      if (maxPrice !== '') params.maxPrice = maxPrice;
      if (inStockOnly) params.inStockOnly = true;

      // Handle sort options
      if (sortBy === 'price_asc') {
        params.sortBy = 'price_asc';
      } else if (sortBy === 'price_desc') {
        params.sortBy = 'price_desc';
      } else if (sortBy === 'rating_desc') {
        params.sortBy = 'rating_desc';
      } else if (sortBy === 'name_asc') {
        params.sortBy = 'name_asc';
      } else if (sortBy === 'name_desc') {
        params.sortBy = 'name_desc';
      } else {
        params.sortBy = 'createdAt';
        params.sortOrder = 'desc';
      }

      const res = await productApi.getProducts(params);
      if (res.success) {
        setProducts(res.products || []);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setServerError('Unable to reach backend API. Ensure the backend server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory, minPrice, maxPrice, inStockOnly, sortBy]);

  // Fetch categories and stats overview
  const loadMetadata = useCallback(async () => {
    try {
      const [catRes, statsRes] = await Promise.all([
        productApi.getCategories(),
        productApi.getStats()
      ]);
      if (catRes.success) {
        setCategories(catRes.categories || []);
      }
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.warn('Metadata fetch warning:', err.message);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  // Handle Add or Edit Product Submit
  const handleSaveProduct = async (productData) => {
    setIsSaving(true);
    try {
      if (productToEdit) {
        const res = await productApi.updateProduct(productToEdit._id, productData);
        if (res.success) {
          showToast(`"${res.product.name}" updated successfully!`, 'success');
          setIsModalOpen(false);
          setProductToEdit(null);
          loadProducts();
          loadMetadata();
        }
      } else {
        const res = await productApi.createProduct(productData);
        if (res.success) {
          showToast(`"${res.product.name}" added to MongoDB successfully!`, 'success');
          setIsModalOpen(false);
          loadProducts();
          loadMetadata();
        }
      }
    } catch (err) {
      console.error('Error saving product:', err);
      const msg = err.response?.data?.message || 'Failed to save product to MongoDB';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete Confirm
  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      const res = await productApi.deleteProduct(deletingProduct._id);
      if (res.success) {
        showToast(`Product deleted successfully`, 'success');
        setDeletingProduct(null);
        if (viewingProduct?._id === deletingProduct._id) {
          setViewingProduct(null);
        }
        loadProducts();
        loadMetadata();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      showToast('Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Reset / Seed Sample Data
  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const res = await productApi.seedProducts();
      if (res.success) {
        showToast(res.message, 'success');
        handleResetFilters();
        loadProducts();
        loadMetadata();
      }
    } catch (err) {
      console.error('Error seeding data:', err);
      showToast('Failed to seed sample products', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Navigation */}
      <Navbar
        onOpenAddModal={() => {
          setProductToEdit(null);
          setIsModalOpen(true);
        }}
        onSeedData={handleSeedData}
        isSeeding={isSeeding}
        totalProducts={totalCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Server Connection Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-sm font-medium">{serverError}</p>
            </div>
            <button
              onClick={() => {
                loadProducts();
                loadMetadata();
              }}
              className="text-xs font-semibold px-3 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Dashboard Statistics Overview */}
        <StatsOverview stats={stats} loading={loading} />

        {/* Horizontal Category Quick Filter Pills */}
        <div className="mb-5">
          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />
        </div>

        {/* Search, Sort, and Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <SearchBar
            search={search}
            onSearchChange={setSearch}
            totalResults={products.length}
            isFiltered={hasActiveFilters}
          />

          {/* Right Controls: Sort & Mobile Filter Toggle */}
          <div className="flex items-center justify-between md:justify-end gap-2.5">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-600" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-sky-500" />
              )}
            </button>

            {/* Sort Dropdown */}
            <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
          </div>
        </div>

        {/* Main Workspace: Filter Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Desktop Left Sidebar: Filters */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={(type, val) => {
                if (type === 'min') setMinPrice(val);
                if (type === 'max') setMaxPrice(val);
              }}
              inStockOnly={inStockOnly}
              onStockToggle={setInStockOnly}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Mobile Filter Drawer / Collapsible */}
          {mobileFilterOpen && (
            <div className="lg:hidden col-span-1 mb-4">
              <FilterSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setMobileFilterOpen(false);
                }}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={(type, val) => {
                  if (type === 'min') setMinPrice(val);
                  if (type === 'max') setMaxPrice(val);
                }}
                inStockOnly={inStockOnly}
                onStockToggle={setInStockOnly}
                onResetFilters={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          )}

          {/* Products Grid Area */}
          <div className="lg:col-span-3">
            {/* Grid Header Info */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-800">
                  {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                </h2>
                <span className="text-xs text-slate-400">
                  ({products.length} {products.length === 1 ? 'item' : 'items'})
                </span>
              </div>
            </div>

            {/* Product Cards Grid */}
            <ProductGrid
              products={products}
              loading={loading}
              onViewDetails={(product) => setViewingProduct(product)}
              onEdit={(product) => {
                setProductToEdit(product);
                setIsModalOpen(true);
              }}
              onDelete={(product) => setDeletingProduct(product)}
              onOpenAddModal={() => {
                setProductToEdit(null);
                setIsModalOpen(true);
              }}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </div>
      </main>

      {/* Modals & Dialogs */}
      {/* 1. Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        isSaving={isSaving}
      />

      {/* 2. Product Detail Modal */}
      <ProductDetailModal
        isOpen={Boolean(viewingProduct)}
        product={viewingProduct}
        onClose={() => setViewingProduct(null)}
        onEdit={(prod) => {
          setViewingProduct(null);
          setProductToEdit(prod);
          setIsModalOpen(true);
        }}
        onDelete={(prod) => {
          setViewingProduct(null);
          setDeletingProduct(prod);
        }}
      />

      {/* 3. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteProduct}
        isDeleting={isDeleting}
      />

      {/* Feedback Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
