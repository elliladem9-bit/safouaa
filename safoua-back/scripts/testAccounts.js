const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const testAccounts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected to MongoDB');

    console.log('🧪 TESTING ALL ACCOUNTS...\n');

    // Test Admin Account
    console.log('👑 ADMIN ACCOUNT TEST:');
    console.log('======================');
    const admin = await User.findOne({ email: 'admin@safouaacademy.com' });
    if (admin) {
      console.log(`✅ Found: ${admin.name} (${admin.email})`);
      console.log(`✅ Role: ${admin.role}`);
      console.log(`✅ Verified: ${admin.isVerified}`);
      
      // Test password
      const adminPasswordTest = await bcrypt.compare('Admin123!', admin.password);
      console.log(`${adminPasswordTest ? '✅' : '❌'} Password: Admin123!`);
    } else {
      console.log('❌ Admin account not found!');
    }

    // Test Teacher Account
    console.log('\n👨‍🏫 TEACHER ACCOUNT TEST:');
    console.log('==========================');
    const teacher = await User.findOne({ email: 'teacher@safouaacademy.com' });
    if (teacher) {
      console.log(`✅ Found: ${teacher.name} (${teacher.email})`);
      console.log(`${teacher.role === 'teacher' ? '✅' : '❌'} Role: ${teacher.role}`);
      console.log(`${teacher.isVerified ? '✅' : '❌'} Verified: ${teacher.isVerified}`);
      console.log(`${teacher.isTeacherApproved ? '✅' : '❌'} Teacher Approved: ${teacher.isTeacherApproved}`);
      console.log(`${teacher.teacherApplicationStatus === 'approved' ? '✅' : '❌'} Application Status: ${teacher.teacherApplicationStatus}`);
      
      // Test password
      const teacherPasswordTest = await bcrypt.compare('Teacher123!', teacher.password);
      console.log(`${teacherPasswordTest ? '✅' : '❌'} Password: Teacher123!`);
      
      // Check if teacher can access teacher features
      const canAccessTeacherFeatures = 
        teacher.role === 'teacher' && 
        teacher.isVerified && 
        teacher.isTeacherApproved && 
        teacher.teacherApplicationStatus === 'approved';
      
      console.log(`${canAccessTeacherFeatures ? '✅' : '❌'} Can Access Teacher Features: ${canAccessTeacherFeatures}`);
      
      if (!canAccessTeacherFeatures) {
        console.log('🔧 FIXING TEACHER ACCOUNT...');
        await User.findByIdAndUpdate(teacher._id, {
          role: 'teacher',
          isVerified: true,
          isTeacherApproved: true,
          teacherApplicationStatus: 'approved'
        });
        console.log('✅ Teacher account fixed!');
      }
    } else {
      console.log('❌ Teacher account not found!');
    }

    // Test Student Account
    console.log('\n👨‍🎓 STUDENT ACCOUNT TEST:');
    console.log('==========================');
    const student = await User.findOne({ email: 'student@safouaacademy.com' });
    if (student) {
      console.log(`✅ Found: ${student.name} (${student.email})`);
      console.log(`${student.role === 'student' ? '✅' : '❌'} Role: ${student.role}`);
      console.log(`${student.isVerified ? '✅' : '❌'} Verified: ${student.isVerified}`);
      
      // Test password
      const studentPasswordTest = await bcrypt.compare('Student123!', student.password);
      console.log(`${studentPasswordTest ? '✅' : '❌'} Password: Student123!`);
    } else {
      console.log('❌ Student account not found!');
    }

    // Summary
    console.log('\n📋 SUMMARY:');
    console.log('============');
    console.log('🔑 LOGIN CREDENTIALS:');
    console.log('');
    console.log('👑 Admin:   admin@safouaacademy.com   / Admin123!');
    console.log('👨‍🏫 Teacher: teacher@safouaacademy.com / Teacher123!');
    console.log('👨‍🎓 Student: student@safouaacademy.com / Student123!');
    console.log('');
    console.log('🌐 Login URL: http://localhost:3000/login');
    console.log('');
    console.log('📱 Expected Teacher Features:');
    console.log('   • Teacher Dashboard (/teacher-dashboard)');
    console.log('   • My Courses menu item');
    console.log('   • Create Course menu item');
    console.log('   • Course management permissions');
    console.log('   • Student enrollment management');

  } catch (error) {
    console.error('❌ Error testing accounts:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
testAccounts();