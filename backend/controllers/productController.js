const Product = require('../models/Product');
const sampleProducts = require('../seedData');
const { isMongoConnected } = require('../config/db');
const localStore = require('../storage/localStore');

// @desc    Get all products with search, filter, and sorting
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStockOnly,
      sortBy = 'createdAt_desc',
      page = 1,
      limit = 100
    } = req.query;

    if (!isMongoConnected()) {
      const data = localStore.getProducts({
        search,
        category,
        minPrice,
        maxPrice,
        inStockOnly,
        sortBy,
        page,
        limit
      });
      return res.status(200).json({
        success: true,
        source: 'embedded-storage',
        ...data
      });
    }

    // --- Mongoose MongoDB Query ---
    const query = {};

    // 1. Search by name, brand, SKU or description
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { sku: searchRegex }
      ];
    }

    // 2. Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // 3. Filter by Price Range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        const min = parseFloat(minPrice);
        if (!isNaN(min)) query.price.$gte = min;
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        const max = parseFloat(maxPrice);
        if (!isNaN(max)) query.price.$lte = max;
      }
      if (Object.keys(query.price).length === 0) {
        delete query.price;
      }
    }

    // 4. Filter by in-stock
    if (inStockOnly === 'true' || inStockOnly === true) {
      query.stock = { $gt: 0 };
    }

    // 5. Sorting
    let sortOptions = {};
    if (sortBy === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sortBy === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sortBy === 'name_asc') {
      sortOptions = { name: 1 };
    } else if (sortBy === 'name_desc') {
      sortOptions = { name: -1 };
    } else if (sortBy === 'rating_desc') {
      sortOptions = { rating: -1 };
    } else {
      sortOptions = { createdAt: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 100;
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      source: 'mongodb',
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const product = localStore.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.status(200).json({ success: true, product });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({
      success: false,
      message: 'Invalid product ID or server error',
      error: error.message
    });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      rating,
      brand,
      sku,
      imageUrl,
      tags,
      isFeatured
    } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }
    if (price === undefined || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return res.status(400).json({ success: false, message: 'A valid non-negative price is required' });
    }
    if (!category) {
      return res.status(400).json({ success: false, message: 'Product category is required' });
    }

    if (!isMongoConnected()) {
      const product = localStore.createProduct(req.body);
      return res.status(201).json({
        success: true,
        message: 'Product added successfully',
        product
      });
    }

    // Auto-generate SKU if none provided
    const generatedSku =
      sku && sku.trim()
        ? sku.trim().toUpperCase()
        : `SKU-${category.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProduct = new Product({
      name: name.trim(),
      description: description ? description.trim() : 'No description provided.',
      price: parseFloat(price),
      category: category.trim(),
      stock: stock !== undefined ? parseInt(stock, 10) : 0,
      rating: rating !== undefined ? parseFloat(rating) : 4.5,
      brand: brand && brand.trim() ? brand.trim() : 'Generic',
      sku: generatedSku,
      imageUrl:
        imageUrl && imageUrl.trim()
          ? imageUrl.trim()
          : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' && tags ? tags.split(',').map(t => t.trim()) : [],
      isFeatured: Boolean(isFeatured)
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product added to MongoDB successfully',
      product: savedProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create product'
    });
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Public
exports.updateProduct = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const updated = localStore.updateProduct(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product: updated
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const {
      name,
      description,
      price,
      category,
      stock,
      rating,
      brand,
      sku,
      imageUrl,
      tags,
      isFeatured
    } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = parseFloat(price);
    if (category !== undefined) product.category = category.trim();
    if (stock !== undefined) product.stock = parseInt(stock, 10);
    if (rating !== undefined) product.rating = parseFloat(rating);
    if (brand !== undefined) product.brand = brand.trim();
    if (sku !== undefined) product.sku = sku.trim().toUpperCase();
    if (imageUrl !== undefined) product.imageUrl = imageUrl.trim();
    if (tags !== undefined) {
      product.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map(t => t.trim())
        : [];
    }
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update product'
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
exports.deleteProduct = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const deleted = localStore.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        id: req.params.id
      });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// @desc    Get categories with counts
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const categories = localStore.getCategories();
      return res.status(200).json({
        success: true,
        categories
      });
    }

    const categoriesAggregation = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalCount = await Product.countDocuments();

    const categories = [
      { name: 'All', count: totalCount },
      ...categoriesAggregation.map(cat => ({ name: cat._id, count: cat.count }))
    ];

    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
};

// @desc    Get quick summary statistics
// @route   GET /api/products/stats
// @access  Public
exports.getStats = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const stats = localStore.getStats();
      return res.status(200).json({
        success: true,
        stats
      });
    }

    const totalProducts = await Product.countDocuments();
    const lowStockCount = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 } });
    const outOfStockCount = await Product.countDocuments({ stock: 0 });

    const statsAggregation = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalInventoryValue: { $sum: { $multiply: ['$price', '$stock'] } },
          avgPrice: { $avg: '$price' },
          totalUnits: { $sum: '$stock' }
        }
      }
    ]);

    const aggregateData = statsAggregation[0] || {
      totalInventoryValue: 0,
      avgPrice: 0,
      totalUnits: 0
    };

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalInventoryValue: Math.round(aggregateData.totalInventoryValue * 100) / 100,
        avgPrice: Math.round(aggregateData.avgPrice * 100) / 100,
        totalUnits: aggregateData.totalUnits,
        lowStockCount,
        outOfStockCount
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
};

// @desc    Seed sample products
// @route   POST /api/products/seed
// @access  Public
exports.seedProducts = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const count = localStore.seedProducts();
      return res.status(201).json({
        success: true,
        message: `Successfully seeded ${count} sample products!`,
        count
      });
    }

    await Product.deleteMany({});
    const inserted = await Product.insertMany(sampleProducts);
    res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} products into MongoDB!`,
      count: inserted.length
    });
  } catch (error) {
    console.error('Error seeding products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed products',
      error: error.message
    });
  }
};
