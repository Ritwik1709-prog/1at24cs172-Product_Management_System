const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, isMongoConnected } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const Product = require('./models/Product');
const sampleProducts = require('./seedData');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
    service: 'Product Management API',
    database: isMongoConnected() ? 'MongoDB' : 'Embedded Local Storage'
  });
});

// Mount Routes
app.use('/api/products', productRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    if (isMongoConnected()) {
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log('MongoDB collection empty: auto-seeding sample products...');
        await Product.insertMany(sampleProducts);
        console.log(`Auto-seeded ${sampleProducts.length} sample products into MongoDB.`);
      } else {
        console.log(`MongoDB connected. Collection has ${count} products.`);
      }
    }

    return new Promise((resolve) => {
      const server = app.listen(PORT, '127.0.0.1', () => {
        console.log(`===============================================`);
        console.log(`🚀 Product Management API is running!`);
        console.log(`📡 URL: http://127.0.0.1:${PORT}`);
        console.log(`📦 Health Check: http://127.0.0.1:${PORT}/api/health`);
        console.log(`🛒 Products: http://127.0.0.1:${PORT}/api/products`);
        console.log(`💾 Storage Mode: ${isMongoConnected() ? 'MongoDB (Mongoose)' : 'Embedded Storage (Fallback)'}`);
        console.log(`===============================================`);
        resolve(server);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
