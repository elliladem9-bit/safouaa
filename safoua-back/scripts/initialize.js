const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
require('dotenv').config();

const initialize = async () => {
  try {
    console.log('🚀 INITIALIZING SAFOUA ACADEMY...\n');

    // Connect to MongoDB with multiple fallback options
    const mongoUris = [
      process.env.MONGO_URI,
      'mongodb://localhost:27017/safoua-academy',
      'mongodb://127.0.0.1:27017/safoua-academy'
    ].filter(Boolean);

    let connected = false;
    for (const uri of mongoUris) {
      try {
        console.log(`🔗 Trying to connect to: ${uri}`);
        await mongoose.connect(uri);
        console.log('✅ MongoDB connected successfully!');
        connected = true;
        break;
      } catch (error) {
        console.log(`❌ Failed to connect to ${uri}: ${error.message}`);
      }
    }

    if (!connected) {
      throw new Error('Could not connect to MongoDB');
    }

    // Clear existing data for fresh start
    console.log('\n🧹 Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('✅ Database cleared');

    // Create Admin User
    console.log('\n👑 Creating Admin User...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@safouaacademy.com',
      password: 'Admin123!',
      role: 'admin',
      isVerified: true,
      isTeacherApproved: true,
      teacherApplicationStatus: 'approved'
    });
    console.log('✅ Admin user created');

    // Create Teacher User
    console.log('\n👨‍🏫 Creating Teacher User...');
    const teacher = await User.create({
      name: 'Teacher User',
      email: 'teacher@safouaacademy.com',
      password: 'Teacher123!',
      role: 'teacher',
      isVerified: true,
      isTeacherApproved: true,
      teacherApplicationStatus: 'approved',
      qualifications: 'Master in Islamic Studies, PhD in Arabic Literature',
      teachingExperience: '10 years of teaching experience in Islamic studies'
    });
    console.log('✅ Teacher user created');

    // Create Student User
    console.log('\n👨‍🎓 Creating Student User...');
    const student = await User.create({
      name: 'Student User',
      email: 'student@safouaacademy.com',
      password: 'Student123!',
      role: 'student',
      isVerified: true
    });
    console.log('✅ Student user created');

    // Create Sample Course
    console.log('\n📚 Creating Sample Course...');
    const sampleCourse = await Course.create({
      title: 'Introduction to Quran',
      description: 'Learn the basics of Quran recitation and understanding. This comprehensive course covers Tajweed rules, basic Arabic, and spiritual guidance.',
      category: 'Quran',
      instructor: teacher._id,
      price: 0,
      isFree: true,
      level: 'Beginner',
      language: 'English',
      isPublished: true,
      learningOutcomes: [
        'Understand basic Tajweed rules',
        'Learn proper Quran recitation',
        'Gain spiritual insights from Quranic verses',
        'Develop a daily Quran reading habit'
      ],
      requirements: [
        'Basic understanding of Arabic letters',
        'Willingness to learn and practice',
        'Access to a Quran (physical or digital)'
      ]
    });
    console.log('✅ Sample course created');

    // Test login functionality
    console.log('\n🔐 Testing Login Functionality...');
    const testUser = await User.findOne({ email: 'admin@safouaacademy.com' }).select('+password');
    const bcrypt = require('bcryptjs');
    const passwordMatch = await bcrypt.compare('Admin123!', testUser.password);
    
    if (passwordMatch) {
      console.log('✅ Password hashing and comparison working');
    } else {
      console.log('❌ Password hashing issue detected');
    }

    console.log('\n🎉 INITIALIZATION COMPLETE!');
    console.log('\n📋 TEST ACCOUNTS:');
    console.log('==================');
    console.log('👑 Admin:   admin@safouaacademy.com   / Admin123!');
    console.log('👨‍🏫 Teacher: teacher@safouaacademy.com / Teacher123!');
    console.log('👨‍🎓 Student: student@safouaacademy.com / Student123!');
    console.log('\n🌐 Frontend URL: http://localhost:3000');
    console.log('🔧 Backend URL: http://localhost:5000');
    console.log('\n✅ Ready to start the application!');

  } catch (error) {
    console.error('❌ Initialization failed:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run initialization
initialize();