const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sampleProducts = require('../seedData');

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'products.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let memoryProducts = [];

const loadFromFile = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      memoryProducts = JSON.parse(raw);
    } else {
      // Seed initial sample data
      memoryProducts = sampleProducts.map((p) => ({
        ...p,
        _id: crypto.randomBytes(12).toString('hex'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      saveToFile();
    }
  } catch (err) {
    console.error('Error loading local products file:', err.message);
    memoryProducts = sampleProducts.map((p) => ({
      ...p,
      _id: crypto.randomBytes(12).toString('hex'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }
};

const saveToFile = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryProducts, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local products file:', err.message);
  }
};

// Initialize
loadFromFile();

const localStore = {
  getProducts: ({
    search,
    category,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy = 'createdAt_desc',
    page = 1,
    limit = 100
  }) => {
    let filtered = [...memoryProducts];

    // Search filter: name, description, brand, or SKU
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (category && category !== 'All') {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Min price
    if (minPrice !== undefined && minPrice !== '') {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filtered = filtered.filter((p) => p.price >= min);
      }
    }

    // Max price
    if (maxPrice !== undefined && maxPrice !== '') {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filtered = filtered.filter((p) => p.price <= max);
      }
    }

    // In-Stock only
    if (inStockOnly === 'true' || inStockOnly === true) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    // Sorting
    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating_desc') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'name_asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name_desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      // Newest first (createdAt desc)
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 100;
    const skip = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(skip, skip + limitNum);

    return {
      count: paginated.length,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limitNum) || 1,
      currentPage: pageNum,
      products: paginated
    };
  },

  getProductById: (id) => {
    return memoryProducts.find((p) => p._id === id);
  },

  createProduct: (data) => {
    const generatedSku =
      data.sku && data.sku.trim()
        ? data.sku.trim().toUpperCase()
        : `SKU-${data.category.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProduct = {
      _id: crypto.randomBytes(12).toString('hex'),
      name: data.name.trim(),
      description: data.description ? data.description.trim() : 'No description provided.',
      price: parseFloat(data.price),
      category: data.category.trim(),
      stock: data.stock !== undefined ? parseInt(data.stock, 10) : 0,
      rating: data.rating !== undefined ? parseFloat(data.rating) : 4.5,
      reviewsCount: 0,
      brand: data.brand && data.brand.trim() ? data.brand.trim() : 'Generic',
      sku: generatedSku,
      imageUrl:
        data.imageUrl && data.imageUrl.trim()
          ? data.imageUrl.trim()
          : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      tags: Array.isArray(data.tags) ? data.tags : typeof data.tags === 'string' && data.tags ? data.tags.split(',').map(t => t.trim()) : [],
      isFeatured: Boolean(data.isFeatured),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    memoryProducts.unshift(newProduct);
    saveToFile();
    return newProduct;
  },

  updateProduct: (id, data) => {
    const index = memoryProducts.findIndex((p) => p._id === id);
    if (index === -1) return null;

    const existing = memoryProducts[index];
    const updated = {
      ...existing,
      ...data,
      price: data.price !== undefined ? parseFloat(data.price) : existing.price,
      stock: data.stock !== undefined ? parseInt(data.stock, 10) : existing.stock,
      rating: data.rating !== undefined ? parseFloat(data.rating) : existing.rating,
      sku: data.sku ? data.sku.trim().toUpperCase() : existing.sku,
      tags: data.tags !== undefined ? (Array.isArray(data.tags) ? data.tags : (typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : [])) : existing.tags,
      updatedAt: new Date().toISOString()
    };

    memoryProducts[index] = updated;
    saveToFile();
    return updated;
  },

  deleteProduct: (id) => {
    const index = memoryProducts.findIndex((p) => p._id === id);
    if (index === -1) return false;
    memoryProducts.splice(index, 1);
    saveToFile();
    return true;
  },

  getCategories: () => {
    const counts = {};
    memoryProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const categoryList = Object.keys(counts)
      .map((cat) => ({ name: cat, count: counts[cat] }))
      .sort((a, b) => b.count - a.count);

    return [{ name: 'All', count: memoryProducts.length }, ...categoryList];
  },

  getStats: () => {
    const totalProducts = memoryProducts.length;
    const lowStockCount = memoryProducts.filter((p) => p.stock > 0 && p.stock <= 10).length;
    const outOfStockCount = memoryProducts.filter((p) => p.stock === 0).length;

    const totalInventoryValue = memoryProducts.reduce((acc, p) => acc + (p.price || 0) * (p.stock || 0), 0);
    const avgPrice = totalProducts > 0 ? memoryProducts.reduce((acc, p) => acc + (p.price || 0), 0) / totalProducts : 0;
    const totalUnits = memoryProducts.reduce((acc, p) => acc + (p.stock || 0), 0);

    return {
      totalProducts,
      totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
      avgPrice: Math.round(avgPrice * 100) / 100,
      totalUnits,
      lowStockCount,
      outOfStockCount
    };
  },

  seedProducts: () => {
    memoryProducts = sampleProducts.map((p) => ({
      ...p,
      _id: crypto.randomBytes(12).toString('hex'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    saveToFile();
    return memoryProducts.length;
  }
};

module.exports = localStore;
