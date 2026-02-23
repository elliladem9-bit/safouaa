const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkProfile = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/safoua-academy');
    
    const admin = await User.findOne({ email: 'admin@safouaacademy.com' });
    
    if (admin) {
      console.log('Admin profile picture URL:', admin.profilePicture);
      console.log('Full URL should be: http://localhost:5001' + admin.profilePicture);
    } else {
      console.log('Admin not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkProfile();
