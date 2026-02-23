const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
require('dotenv').config();

const addLessons = async () => {
  try {
    console.log('🚀 Adding lessons to existing course...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/safoua-academy');
    console.log('✅ MongoDB connected\n');

    // Get the course ID from command line or use the first course
    const courseId = process.argv[2];
    
    let course;
    if (courseId) {
      course = await Course.findById(courseId);
    } else {
      // Get the first published course
      course = await Course.findOne({ isPublished: true });
    }

    if (!course) {
      console.log('❌ No course found');
      process.exit(1);
    }

    console.log(`📚 Adding lessons to: ${course.title}`);
    console.log(`   Course ID: ${course._id}\n`);

    // Check if lessons already exist
    const existingLessons = await Lesson.find({ course: course._id });
    if (existingLessons.length > 0) {
      console.log(`⚠️  Course already has ${existingLessons.length} lessons`);
      console.log('   Skipping lesson creation\n');
    } else {
      // Create sample lessons
      const lessons = [
        {
          title: 'Introduction to the Course',
          description: 'Welcome to the course! In this lesson, we will introduce the course objectives and what you will learn.',
          content: 'Welcome to this comprehensive course. Throughout this journey, you will gain valuable knowledge and practical skills. Let\'s begin by understanding the course structure and learning objectives.',
          course: course._id,
          order: 1,
          duration: 10,
          isFree: true,
          isPublished: true
        },
        {
          title: 'Lesson 1: Fundamentals',
          description: 'Learn the fundamental concepts that form the foundation of this subject.',
          content: 'In this lesson, we cover the essential fundamentals. Understanding these core concepts is crucial for your progress in the course. Take your time to absorb this material.',
          course: course._id,
          order: 2,
          duration: 15,
          isFree: false,
          isPublished: true
        },
        {
          title: 'Lesson 2: Practical Application',
          description: 'Apply what you\'ve learned through practical examples and exercises.',
          content: 'Now that you understand the fundamentals, let\'s apply them in practical scenarios. This hands-on approach will solidify your understanding.',
          course: course._id,
          order: 3,
          duration: 20,
          isFree: false,
          isPublished: true
        },
        {
          title: 'Lesson 3: Advanced Concepts',
          description: 'Dive deeper into advanced topics and techniques.',
          content: 'In this advanced lesson, we explore more complex concepts. These techniques will enhance your skills and knowledge significantly.',
          course: course._id,
          order: 4,
          duration: 25,
          isFree: false,
          isPublished: true
        },
        {
          title: 'Final Assessment',
          description: 'Test your knowledge and complete the course assessment.',
          content: 'Congratulations on reaching the final lesson! This assessment will help you evaluate your understanding of the course material.',
          course: course._id,
          order: 5,
          duration: 30,
          isFree: false,
          isPublished: true
        }
      ];

      await Lesson.insertMany(lessons);
      console.log(`✅ Created ${lessons.length} lessons\n`);

      // Update course with total duration
      const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
      course.totalDuration = totalDuration;
      await course.save();
      console.log(`✅ Updated course total duration: ${totalDuration} minutes\n`);
    }

    console.log('🎉 COMPLETE!');
    console.log(`\n📋 Course Details:`);
    console.log(`   Title: ${course.title}`);
    console.log(`   ID: ${course._id}`);
    console.log(`   Lessons: ${await Lesson.countDocuments({ course: course._id })}`);
    console.log(`\n🌐 View course at: http://localhost:3001/courses/${course._id}`);
    console.log(`🎬 Play course at: http://localhost:3001/courses/${course._id}/play`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

addLessons();
