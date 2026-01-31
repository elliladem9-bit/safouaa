const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create Admin User
    const adminExists = await User.findOne({ email: 'admin@safouaacademy.com' });
    let admin;
    
    if (!adminExists) {
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@safouaacademy.com',
        password: 'Admin123!',
        role: 'admin',
        isVerified: true,
        isTeacherApproved: true,
        teacherApplicationStatus: 'approved'
      });
      console.log('✅ Admin user created');
    } else {
      admin = adminExists;
      console.log('ℹ️  Admin user already exists');
    }

    // Create Teacher User
    const teacherExists = await User.findOne({ email: 'teacher@safouaacademy.com' });
    let teacher;
    
    if (!teacherExists) {
      teacher = await User.create({
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
    } else {
      // Update existing teacher to ensure proper approval status
      teacher = await User.findByIdAndUpdate(teacherExists._id, {
        role: 'teacher',
        isVerified: true,
        isTeacherApproved: true,
        teacherApplicationStatus: 'approved',
        qualifications: 'Master in Islamic Studies, PhD in Arabic Literature',
        teachingExperience: '10 years of teaching experience in Islamic studies'
      }, { new: true });
      console.log('✅ Teacher user updated with proper approval status');
    }

    // Create Student User
    const studentExists = await User.findOne({ email: 'student@safouaacademy.com' });
    let student;
    
    if (!studentExists) {
      student = await User.create({
        name: 'Student User',
        email: 'student@safouaacademy.com',
        password: 'Student123!',
        role: 'student',
        isVerified: true
      });
      console.log('✅ Student user created');
    } else {
      student = studentExists;
      console.log('ℹ️  Student user already exists');
    }

    // Create Sample Courses
    const courseExists = await Course.findOne({ title: 'Introduction to Quran' });
    
    if (!courseExists) {
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

      const islamicStudiesCourse = await Course.create({
        title: 'Islamic History and Civilization',
        description: 'Explore the rich history of Islamic civilization, from the time of Prophet Muhammad (PBUH) to the modern era.',
        category: 'Islamic Sciences',
        instructor: teacher._id,
        price: 29.99,
        isFree: false,
        level: 'Intermediate',
        language: 'English',
        isPublished: true,
        learningOutcomes: [
          'Understand key events in Islamic history',
          'Learn about Islamic contributions to science and culture',
          'Analyze the development of Islamic societies',
          'Connect historical lessons to modern contexts'
        ],
        requirements: [
          'Basic knowledge of Islamic principles',
          'Interest in history and culture',
          'Commitment to complete the course'
        ]
      });

      console.log('✅ Sample courses created');
    } else {
      console.log('ℹ️  Sample courses already exist');
    }

    console.log('\n🎉 Database seeding completed!');
    console.log('\n📋 Test Accounts Created:');
    console.log('');
    console.log('👑 ADMIN ACCOUNT:');
    console.log('   Email: admin@safouaacademy.com');
    console.log('   Password: Admin123!');
    console.log('   Role: admin');
    console.log('');
    console.log('👨‍🏫 TEACHER ACCOUNT:');
    console.log('   Email: teacher@safouaacademy.com');
    console.log('   Password: Teacher123!');
    console.log('   Role: teacher (approved)');
    console.log('');
    console.log('👨‍🎓 STUDENT ACCOUNT:');
    console.log('   Email: student@safouaacademy.com');
    console.log('   Password: Student123!');
    console.log('   Role: student');
    console.log('');
    console.log('🌐 Login at: http://localhost:3000/login');
    console.log('');
    console.log('⚠️  IMPORTANT: Change these passwords in production!');

  } catch (error) {
    console.error('Error seeding database:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run the script
seedDatabase();