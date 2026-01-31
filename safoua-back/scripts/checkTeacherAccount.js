const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkTeacherAccount = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the teacher account
    const teacher = await User.findOne({ email: 'teacher@safouaacademy.com' });
    
    if (!teacher) {
      console.log('❌ Teacher account not found!');
      console.log('Run: npm run seed');
      return;
    }

    console.log('👨‍🏫 TEACHER ACCOUNT STATUS:');
    console.log('================================');
    console.log(`Name: ${teacher.name}`);
    console.log(`Email: ${teacher.email}`);
    console.log(`Role: ${teacher.role}`);
    console.log(`Is Verified: ${teacher.isVerified}`);
    console.log(`Is Teacher Approved: ${teacher.isTeacherApproved}`);
    console.log(`Teacher Application Status: ${teacher.teacherApplicationStatus}`);
    console.log(`Created At: ${teacher.createdAt}`);
    console.log('');

    // Check for potential issues
    const issues = [];
    
    if (teacher.role !== 'teacher') {
      issues.push('❌ Role is not set to "teacher"');
    }
    
    if (!teacher.isVerified) {
      issues.push('❌ Account is not verified');
    }
    
    if (!teacher.isTeacherApproved) {
      issues.push('❌ Teacher is not approved');
    }
    
    if (teacher.teacherApplicationStatus !== 'approved') {
      issues.push('❌ Teacher application status is not "approved"');
    }

    if (issues.length > 0) {
      console.log('🚨 ISSUES FOUND:');
      issues.forEach(issue => console.log(`   ${issue}`));
      console.log('');
      console.log('🔧 FIXING ISSUES...');
      
      // Fix the issues
      teacher.role = 'teacher';
      teacher.isVerified = true;
      teacher.isTeacherApproved = true;
      teacher.teacherApplicationStatus = 'approved';
      
      await teacher.save();
      console.log('✅ Teacher account fixed!');
    } else {
      console.log('✅ Teacher account is properly configured!');
    }

    console.log('');
    console.log('🔑 LOGIN CREDENTIALS:');
    console.log('Email: teacher@safouaacademy.com');
    console.log('Password: Teacher123!');

  } catch (error) {
    console.error('Error checking teacher account:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run the script
checkTeacherAccount();