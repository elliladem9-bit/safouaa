const mongoose = require('mongoose');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
require('dotenv').config();

const addSampleLessons = async () => {
  try {
    console.log('🚀 ADDING SAMPLE LESSONS...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');

    // Find the sample course
    const courses = await Course.find({});
    console.log(`📊 Found ${courses.length} courses in database`);
    
    if (courses.length > 0) {
      console.log('Available courses:');
      courses.forEach(course => {
        console.log(`- ${course.title} (ID: ${course._id})`);
      });
    }
    
    const course = await Course.findOne({ title: 'Introduction to Quran' });
    
    if (!course) {
      console.log('❌ Sample course not found. Please run initialization first.');
      return;
    }

    console.log(`📚 Found course: ${course.title}`);

    // Create sample lessons
    const lessons = [
      {
        title: 'Welcome to Quran Recitation',
        content: `Welcome to this comprehensive course on Quran recitation. In this introductory lesson, we will cover:

• The importance of proper Quran recitation
• Basic Arabic pronunciation rules
• How to approach learning Tajweed
• Course structure and expectations

This course is designed for beginners who want to learn the beautiful art of Quran recitation with proper pronunciation and rhythm.`,
        course: course._id,
        order: 1,
        duration: 15,
        isFree: true,
        isPublished: true
      },
      {
        title: 'Arabic Alphabet and Pronunciation',
        content: `In this lesson, we will learn the Arabic alphabet and proper pronunciation:

• The 28 letters of the Arabic alphabet
• Correct pronunciation of each letter
• Letter shapes in different positions
• Practice exercises for pronunciation

Understanding the Arabic alphabet is fundamental to proper Quran recitation. Each letter has its unique sound and characteristics.`,
        course: course._id,
        order: 2,
        duration: 25,
        isFree: false,
        isPublished: true
      },
      {
        title: 'Basic Tajweed Rules',
        content: `This lesson introduces the fundamental rules of Tajweed:

• What is Tajweed and why is it important?
• Makharij (Points of articulation)
• Sifaat (Characteristics of letters)
• Basic rules for proper recitation

Tajweed is the art of reciting the Quran correctly, giving each letter its due right and characteristics.`,
        course: course._id,
        order: 3,
        duration: 30,
        isFree: false,
        isPublished: true
      },
      {
        title: 'Noon Sakinah and Tanween Rules',
        content: `Learn the important rules of Noon Sakinah and Tanween:

• Definition of Noon Sakinah and Tanween
• The four rules: Izhar, Idgham, Iqlab, Ikhfa
• When and how to apply each rule
• Practice examples from the Quran

These rules are essential for proper Quran recitation and will greatly improve your pronunciation.`,
        course: course._id,
        order: 4,
        duration: 35,
        isFree: false,
        isPublished: true
      },
      {
        title: 'Meem Sakinah Rules',
        content: `Understanding the rules of Meem Sakinah:

• What is Meem Sakinah?
• The three rules: Ikhfa Shafawi, Idgham Mithlayn, Izhar Shafawi
• Practical application in Quranic verses
• Common mistakes to avoid

Master these rules to enhance your recitation quality and accuracy.`,
        course: course._id,
        order: 5,
        duration: 20,
        isFree: false,
        isPublished: true
      }
    ];

    // Create lessons
    const createdLessons = [];
    for (const lessonData of lessons) {
      const lesson = await Lesson.create(lessonData);
      createdLessons.push(lesson);
      console.log(`✅ Created lesson: ${lesson.title}`);
    }

    // Update course with lessons
    await Course.findByIdAndUpdate(course._id, {
      $push: { lessons: { $each: createdLessons.map(l => l._id) } },
      totalDuration: createdLessons.reduce((total, lesson) => total + lesson.duration, 0)
    });

    console.log(`✅ Updated course with ${createdLessons.length} lessons`);
    console.log(`📊 Total course duration: ${createdLessons.reduce((total, lesson) => total + lesson.duration, 0)} minutes`);

    console.log('\n🎉 SAMPLE LESSONS ADDED SUCCESSFULLY!');
    console.log('\n📋 LESSONS CREATED:');
    console.log('==================');
    createdLessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ${lesson.title} (${lesson.duration} min) - ${lesson.isFree ? 'Free' : 'Premium'}`);
    });

    console.log('\n✅ You can now test the course player with these lessons!');

  } catch (error) {
    console.error('❌ Failed to add sample lessons:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run the script
addSampleLessons();