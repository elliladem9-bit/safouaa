const mongoose = require('mongoose');
const { Surah } = require('../models/Quran');
require('dotenv').config();

async function clearAyahs() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/safoua-academy');
    console.log('✅ Connected to MongoDB');
    
    // Clear all ayahs from all surahs to force re-fetch with audio
    const result = await Surah.updateMany({}, { $set: { ayahs: [] } });
    console.log(`✅ Cleared cached ayahs from ${result.modifiedCount} surahs`);
    console.log('📥 Ayahs will be re-fetched with audio on next request');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

clearAyahs();
