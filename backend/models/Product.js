const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      enum: {
        values: [
          'Electronics',
          'Clothing',
          'Home & Kitchen',
          'Beauty & Personal Care',
          'Books & Stationery',
          'Sports & Outdoors',
          'Toys & Games',
          'Automotive',
          'Health & Wellness',
          'Other'
        ],
        message: '{VALUE} is not a supported category'
      }
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be greater than 5'],
      default: 4.5
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0
    },
    brand: {
      type: String,
      trim: true,
      default: 'Generic'
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true
    },
    imageUrl: {
      type: String,
      trim: true,
      default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
    },
    tags: {
      type: [String],
      default: []
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster search and filtering
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
