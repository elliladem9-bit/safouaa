const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const fixTeacherAccount = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected to MongoDB');

    // Find and fix the teacher account
    const teacher = await User.findOneAndUpdate(
      { email: 'teacher@safouaacademy.com' },
      {
        $set: {
          role: 'teacher',
          isVerified: true,
          isTeacherApproved: true,
          teacherApplicationStatus: 'approved',
          qualifications: 'Master in Islamic Studies, PhD in Arabic Literature',
          teachingExperience: '10 years of teaching experience in Islamic studies'
        }
      },
      { 
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    if (!teacher) {
      // Create new teacher if doesn't exist
      const newTeacher = await User.create({
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
      console.log('✅ New teacher account created');
    } else {
      console.log('✅ Teacher account updated/fixed');
    }

    // Verify the fix
    const verifyTeacher = await User.findOne({ email: 'teacher@safouaacademy.com' });
    
    console.log('\n📊 TEACHER ACCOUNT STATUS:');
    console.log('==========================');
    console.log(`Name: ${verifyTeacher.name}`);
    console.log(`Email: ${verifyTeacher.email}`);
    console.log(`Role: ${verifyTeacher.role}`);
    console.log(`Is Verified: ${verifyTeacher.isVerified}`);
    console.log(`Is Teacher Approved: ${verifyTeacher.isTeacherApproved}`);
    console.log(`Teacher Application Status: ${verifyTeacher.teacherApplicationStatus}`);
    
    // Check if all required fields are correct
    const isCorrect = 
      verifyTeacher.role === 'teacher' &&
      verifyTeacher.isVerified === true &&
      verifyTeacher.isTeacherApproved === true &&
      verifyTeacher.teacherApplicationStatus === 'approved';

    if (isCorrect) {
      console.log('\n🎉 SUCCESS! Teacher account is properly configured!');
      console.log('\n🔑 LOGIN CREDENTIALS:');
      console.log('   Email: teacher@safouaacademy.com');
      console.log('   Password: Teacher123!');
      console.log('\n📱 Expected Features:');
      console.log('   ✅ Teacher Dashboard access');
      console.log('   ✅ "My Courses" menu item');
      console.log('   ✅ "Create Course" menu item');
      console.log('   ✅ Course creation permissions');
      console.log('   ✅ Student enrollment management');
    } else {
      console.log('\n❌ Something is still wrong. Please check the database manually.');
    }

  } catch (error) {
    console.error('❌ Error fixing teacher account:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
fixTeacherAccount();