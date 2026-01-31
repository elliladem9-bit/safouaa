const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
require('dotenv').config();

const createTestEnrollment = async () => {
  try {
    console.log('🚀 CREATING TEST ENROLLMENT...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');

    // Find the student and course
    const student = await User.findOne({ email: 'student@safouaacademy.com' });
    const course = await Course.findOne({ title: 'Introduction to Quran' });

    if (!student) {
      console.log('❌ Student account not found');
      return;
    }

    if (!course) {
      console.log('❌ Course not found');
      return;
    }

    console.log(`👨‍🎓 Found student: ${student.name} (${student.email})`);
    console.log(`📚 Found course: ${course.title}`);

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({
      student: student._id,
      course: course._id
    });

    if (existingEnrollment) {
      console.log('✅ Enrollment already exists');
      return;
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: student._id,
      course: course._id,
      enrollmentMethod: 'direct'
    });

    // Add student to course
    await Course.findByIdAndUpdate(course._id, {
      $addToSet: { students: student._id }
    });

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(student._id, {
      $addToSet: { enrolledCourses: course._id }
    });

    console.log('✅ Test enrollment created successfully!');
    console.log(`📊 Enrollment ID: ${enrollment._id}`);

    console.log('\n🎉 TEST ENROLLMENT COMPLETE!');
    console.log('\n✅ You can now login as student and access the course player!');
    console.log('👨‍🎓 Student Login: student@safouaacademy.com / Student123!');

  } catch (error) {
    console.error('❌ Failed to create test enrollment:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run the script
createTestEnrollment();