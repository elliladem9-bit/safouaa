const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@safouaacademy.com' });
    if (existingAdmin) {
      console.log('Admin account already exists!');
      console.log('Email: admin@safouaacademy.com');
      console.log('You can reset the password if needed.');
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      name: 'Admin User',
      email: 'admin@safouaacademy.com',
      password: 'Admin123!',
      role: 'admin',
      isVerified: true,
      isTeacherApproved: true,
      teacherApplicationStatus: 'approved'
    };

    const admin = await User.create(adminData);
    console.log('✅ Admin account created successfully!');
    console.log('');
    console.log('📧 Email: admin@safouaacademy.com');
    console.log('🔑 Password: Admin123!');
    console.log('👑 Role: admin');
    console.log('');
    console.log('⚠️  Please change the password after first login!');
    console.log('');
    console.log('You can now login to the admin panel at: http://localhost:3000/login');

  } catch (error) {
    console.error('Error creating admin:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run the script
createAdmin();