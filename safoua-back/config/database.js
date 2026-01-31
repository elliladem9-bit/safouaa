const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/safoua-academy';
    
    const conn = await mongoose.connect(mongoUri);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`MongoDB Error: ${error.message}`);
    
    // Try alternative connection strings
    const fallbackUris = [
      'mongodb://127.0.0.1:27017/safoua-academy',
      'mongodb://localhost:27017/safoua-academy'
    ];
    
    for (const uri of fallbackUris) {
      try {
        logger.info(`Trying fallback connection: ${uri}`);
        const conn = await mongoose.connect(uri);
        logger.info(`MongoDB Connected via fallback: ${conn.connection.host}`);
        return conn;
      } catch (fallbackError) {
        logger.error(`Fallback connection failed: ${fallbackError.message}`);
      }
    }
    
    logger.error('All MongoDB connection attempts failed');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
