const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
require('dotenv').config();

const addSampleMedia = async () => {
  try {
    console.log('🚀 ADDING SAMPLE MEDIA TO LESSONS...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');

    // Find lessons
    const lessons = await Lesson.find({}).sort({ order: 1 });
    console.log(`📚 Found ${lessons.length} lessons`);

    if (lessons.length === 0) {
      console.log('❌ No lessons found. Please run addSampleLessons.js first.');
      return;
    }

    // Sample media URLs (using public demo videos/audios)
    const sampleMedia = [
      {
        // Lesson 1: Welcome - Video lesson
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        documents: [
          {
            title: 'Course Introduction Guide.pdf',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            fileType: 'application/pdf'
          },
          {
            title: 'Arabic Alphabet Chart.pdf',
            url: 'https://www.africau.edu/images/default/sample.pdf',
            fileType: 'application/pdf'
          }
        ]
      },
      {
        // Lesson 2: Arabic Alphabet - Audio lesson
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        documents: [
          {
            title: 'Arabic Letters Practice Sheet.pdf',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            fileType: 'application/pdf'
          }
        ]
      },
      {
        // Lesson 3: Basic Tajweed - Video lesson
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        documents: [
          {
            title: 'Tajweed Rules Summary.pdf',
            url: 'https://www.africau.edu/images/default/sample.pdf',
            fileType: 'application/pdf'
          },
          {
            title: 'Makharij Chart.pdf',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            fileType: 'application/pdf'
          }
        ]
      },
      {
        // Lesson 4: Noon Sakinah - Audio lesson
        audioUrl: 'https://file-examples.com/storage/fe68c1b7c1a9fd42b2b9e5b/2017/11/file_example_MP3_700KB.mp3',
        documents: [
          {
            title: 'Noon Sakinah Examples.pdf',
            url: 'https://www.africau.edu/images/default/sample.pdf',
            fileType: 'application/pdf'
          }
        ]
      },
      {
        // Lesson 5: Meem Sakinah - Text only with documents
        documents: [
          {
            title: 'Meem Sakinah Rules.pdf',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            fileType: 'application/pdf'
          },
          {
            title: 'Practice Exercises.pdf',
            url: 'https://www.africau.edu/images/default/sample.pdf',
            fileType: 'application/pdf'
          }
        ]
      }
    ];

    // Update lessons with media
    for (let i = 0; i < lessons.length && i < sampleMedia.length; i++) {
      const lesson = lessons[i];
      const media = sampleMedia[i];
      
      const updateData = {
        documents: media.documents || []
      };
      
      if (media.videoUrl) {
        updateData.videoUrl = media.videoUrl;
      }
      
      if (media.audioUrl) {
        updateData.audioUrl = media.audioUrl;
      }
      
      await Lesson.findByIdAndUpdate(lesson._id, updateData);
      
      console.log(`✅ Updated lesson: ${lesson.title}`);
      if (media.videoUrl) console.log(`   📹 Added video URL`);
      if (media.audioUrl) console.log(`   🎵 Added audio URL`);
      if (media.documents) console.log(`   📄 Added ${media.documents.length} documents`);
    }

    console.log('\n🎉 SAMPLE MEDIA ADDED SUCCESSFULLY!');
    console.log('\n📋 MEDIA SUMMARY:');
    console.log('==================');
    console.log('📹 Video lessons: 2');
    console.log('🎵 Audio lessons: 2');
    console.log('📄 Text lesson: 1');
    console.log('📁 Total PDF documents: 7');

    console.log('\n✅ You can now test the course player with real media!');

  } catch (error) {
    console.error('❌ Failed to add sample media:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run the script
addSampleMedia();