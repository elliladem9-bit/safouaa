const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();

const diagnose = async () => {
  console.log('🔍 DIAGNOSING SAFOUA ACADEMY BACKEND...\n');

  // Check environment variables
  console.log('📋 ENVIRONMENT VARIABLES:');
  console.log('==========================');
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`);
  console.log(`PORT: ${process.env.PORT || 'NOT SET (will use 5000)'}`);
  console.log(`MONGO_URI: ${process.env.MONGO_URI ? 'SET' : 'NOT SET'}`);
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'SET' : 'NOT SET'}`);
  console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL || 'NOT SET'}`);

  // Test MongoDB connection
  console.log('\n🗄️  MONGODB CONNECTION:');
  console.log('========================');
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/safoua-academy';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
    
    // Test database operations
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    console.log(`✅ Found ${userCount} users in database`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.log(`❌ MongoDB connection failed: ${error.message}`);
    console.log('💡 Make sure MongoDB is running on your system');
  }

  // Test Express server
  console.log('\n🌐 EXPRESS SERVER TEST:');
  console.log('========================');
  try {
    const app = express();
    app.get('/test', (req, res) => res.json({ status: 'OK' }));
    
    const server = app.listen(5001, () => {
      console.log('✅ Express server can start successfully');
      server.close();
    });
  } catch (error) {
    console.log(`❌ Express server test failed: ${error.message}`);
  }

  // Check required files
  console.log('\n📁 REQUIRED FILES CHECK:');
  console.log('=========================');
  const fs = require('fs');
  const requiredFiles = [
    'models/User.js',
    'routes/auth.js',
    'controllers/authController.js',
    'middleware/auth.js',
    'config/database.js'
  ];

  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - MISSING`);
    }
  });

  console.log('\n🔧 QUICK FIXES:');
  console.log('================');
  console.log('1. Copy .env.development to .env:');
  console.log('   cp .env.development .env');
  console.log('');
  console.log('2. Install dependencies:');
  console.log('   npm install');
  console.log('');
  console.log('3. Start MongoDB (if not running):');
  console.log('   brew services start mongodb/brew/mongodb-community');
  console.log('   # OR');
  console.log('   mongod');
  console.log('');
  console.log('4. Seed the database:');
  console.log('   npm run seed');
  console.log('');
  console.log('5. Start the server:');
  console.log('   npm run dev');

  process.exit(0);
};

diagnose();