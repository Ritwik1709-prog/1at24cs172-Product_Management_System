const mongoose = require('mongoose');

let mongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/product_management';

  try {
    console.log(`Connecting to MongoDB at: ${uri}...`);
    // Connect with a 2.5 second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    mongoConnected = true;
    console.log(`[MongoDB] Connected successfully to MongoDB at: ${uri}`);
  } catch (err) {
    mongoConnected = false;
    console.warn(`[MongoDB] Could not establish connection to ${uri} (${err.message})`);
    console.log(`[Storage] Auto-activating Embedded Local Storage Mode.`);
    console.log(`[Storage] All features (Search, Filter, Sort, Add, Edit, Delete) are fully functional!`);
    console.log(`[Storage] To connect to MongoDB, ensure mongod is running or update MONGODB_URI in backend/.env.`);
  }
};

const isMongoConnected = () => mongoConnected;

const disconnectDB = async () => {
  if (mongoConnected) {
    await mongoose.disconnect();
    mongoConnected = false;
  }
};

module.exports = { connectDB, isMongoConnected, disconnectDB };
