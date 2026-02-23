const mongoose = require('mongoose');
const { Surah } = require('../models/Quran');
require('dotenv').config();

const populateQuran = async () => {
  try {
    console.log('🕌 Populating Quran Al-Kareem...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/safoua-academy');
    console.log('✅ MongoDB connected\n');

    // Clear existing data
    await Surah.deleteMany({});
    console.log('🧹 Cleared existing Quran data\n');

    // All 114 Surahs of the Quran
    const surahs = [
      { number: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', englishTranslation: 'The Opening', revelationType: 'Meccan', numberOfAyahs: 7 },
      { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', englishTranslation: 'The Cow', revelationType: 'Medinan', numberOfAyahs: 286 },
      { number: 3, name: 'آل عمران', englishName: 'Ali \'Imran', englishTranslation: 'Family of Imran', revelationType: 'Medinan', numberOfAyahs: 200 },
      { number: 4, name: 'النساء', englishName: 'An-Nisa', englishTranslation: 'The Women', revelationType: 'Medinan', numberOfAyahs: 176 },
      { number: 5, name: 'المائدة', englishName: 'Al-Ma\'idah', englishTranslation: 'The Table Spread', revelationType: 'Medinan', numberOfAyahs: 120 },
      { number: 6, name: 'الأنعام', englishName: 'Al-An\'am', englishTranslation: 'The Cattle', revelationType: 'Meccan', numberOfAyahs: 165 },
      { number: 7, name: 'الأعراف', englishName: 'Al-A\'raf', englishTranslation: 'The Heights', revelationType: 'Meccan', numberOfAyahs: 206 },
      { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', englishTranslation: 'The Spoils of War', revelationType: 'Medinan', numberOfAyahs: 75 },
      { number: 9, name: 'التوبة', englishName: 'At-Tawbah', englishTranslation: 'The Repentance', revelationType: 'Medinan', numberOfAyahs: 129 },
      { number: 10, name: 'يونس', englishName: 'Yunus', englishTranslation: 'Jonah', revelationType: 'Meccan', numberOfAyahs: 109 },
      { number: 11, name: 'هود', englishName: 'Hud', englishTranslation: 'Hud', revelationType: 'Meccan', numberOfAyahs: 123 },
      { number: 12, name: 'يوسف', englishName: 'Yusuf', englishTranslation: 'Joseph', revelationType: 'Meccan', numberOfAyahs: 111 },
      { number: 13, name: 'الرعد', englishName: 'Ar-Ra\'d', englishTranslation: 'The Thunder', revelationType: 'Medinan', numberOfAyahs: 43 },
      { number: 14, name: 'ابراهيم', englishName: 'Ibrahim', englishTranslation: 'Abraham', revelationType: 'Meccan', numberOfAyahs: 52 },
      { number: 15, name: 'الحجر', englishName: 'Al-Hijr', englishTranslation: 'The Rocky Tract', revelationType: 'Meccan', numberOfAyahs: 99 },
      { number: 16, name: 'النحل', englishName: 'An-Nahl', englishTranslation: 'The Bee', revelationType: 'Meccan', numberOfAyahs: 128 },
      { number: 17, name: 'الإسراء', englishName: 'Al-Isra', englishTranslation: 'The Night Journey', revelationType: 'Meccan', numberOfAyahs: 111 },
      { number: 18, name: 'الكهف', englishName: 'Al-Kahf', englishTranslation: 'The Cave', revelationType: 'Meccan', numberOfAyahs: 110 },
      { number: 19, name: 'مريم', englishName: 'Maryam', englishTranslation: 'Mary', revelationType: 'Meccan', numberOfAyahs: 98 },
      { number: 20, name: 'طه', englishName: 'Taha', englishTranslation: 'Ta-Ha', revelationType: 'Meccan', numberOfAyahs: 135 },
      { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', englishTranslation: 'The Prophets', revelationType: 'Meccan', numberOfAyahs: 112 },
      { number: 22, name: 'الحج', englishName: 'Al-Hajj', englishTranslation: 'The Pilgrimage', revelationType: 'Medinan', numberOfAyahs: 78 },
      { number: 23, name: 'المؤمنون', englishName: 'Al-Mu\'minun', englishTranslation: 'The Believers', revelationType: 'Meccan', numberOfAyahs: 118 },
      { number: 24, name: 'النور', englishName: 'An-Nur', englishTranslation: 'The Light', revelationType: 'Medinan', numberOfAyahs: 64 },
      { number: 25, name: 'الفرقان', englishName: 'Al-Furqan', englishTranslation: 'The Criterion', revelationType: 'Meccan', numberOfAyahs: 77 },
      { number: 26, name: 'الشعراء', englishName: 'Ash-Shu\'ara', englishTranslation: 'The Poets', revelationType: 'Meccan', numberOfAyahs: 227 },
      { number: 27, name: 'النمل', englishName: 'An-Naml', englishTranslation: 'The Ant', revelationType: 'Meccan', numberOfAyahs: 93 },
      { number: 28, name: 'القصص', englishName: 'Al-Qasas', englishTranslation: 'The Stories', revelationType: 'Meccan', numberOfAyahs: 88 },
      { number: 29, name: 'العنكبوت', englishName: 'Al-Ankabut', englishTranslation: 'The Spider', revelationType: 'Meccan', numberOfAyahs: 69 },
      { number: 30, name: 'الروم', englishName: 'Ar-Rum', englishTranslation: 'The Romans', revelationType: 'Meccan', numberOfAyahs: 60 },
      { number: 31, name: 'لقمان', englishName: 'Luqman', englishTranslation: 'Luqman', revelationType: 'Meccan', numberOfAyahs: 34 },
      { number: 32, name: 'السجدة', englishName: 'As-Sajdah', englishTranslation: 'The Prostration', revelationType: 'Meccan', numberOfAyahs: 30 },
      { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', englishTranslation: 'The Combined Forces', revelationType: 'Medinan', numberOfAyahs: 73 },
      { number: 34, name: 'سبإ', englishName: 'Saba', englishTranslation: 'Sheba', revelationType: 'Meccan', numberOfAyahs: 54 },
      { number: 35, name: 'فاطر', englishName: 'Fatir', englishTranslation: 'Originator', revelationType: 'Meccan', numberOfAyahs: 45 },
      { number: 36, name: 'يس', englishName: 'Ya-Sin', englishTranslation: 'Ya Sin', revelationType: 'Meccan', numberOfAyahs: 83 },
      { number: 37, name: 'الصافات', englishName: 'As-Saffat', englishTranslation: 'Those who set the Ranks', revelationType: 'Meccan', numberOfAyahs: 182 },
      { number: 38, name: 'ص', englishName: 'Sad', englishTranslation: 'The Letter Saad', revelationType: 'Meccan', numberOfAyahs: 88 },
      { number: 39, name: 'الزمر', englishName: 'Az-Zumar', englishTranslation: 'The Troops', revelationType: 'Meccan', numberOfAyahs: 75 },
      { number: 40, name: 'غافر', englishName: 'Ghafir', englishTranslation: 'The Forgiver', revelationType: 'Meccan', numberOfAyahs: 85 },
      { number: 41, name: 'فصلت', englishName: 'Fussilat', englishTranslation: 'Explained in Detail', revelationType: 'Meccan', numberOfAyahs: 54 },
      { number: 42, name: 'الشورى', englishName: 'Ash-Shuraa', englishTranslation: 'The Consultation', revelationType: 'Meccan', numberOfAyahs: 53 },
      { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', englishTranslation: 'The Ornaments of Gold', revelationType: 'Meccan', numberOfAyahs: 89 },
      { number: 44, name: 'الدخان', englishName: 'Ad-Dukhan', englishTranslation: 'The Smoke', revelationType: 'Meccan', numberOfAyahs: 59 },
      { number: 45, name: 'الجاثية', englishName: 'Al-Jathiyah', englishTranslation: 'The Crouching', revelationType: 'Meccan', numberOfAyahs: 37 },
      { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', englishTranslation: 'The Wind-Curved Sandhills', revelationType: 'Meccan', numberOfAyahs: 35 },
      { number: 47, name: 'محمد', englishName: 'Muhammad', englishTranslation: 'Muhammad', revelationType: 'Medinan', numberOfAyahs: 38 },
      { number: 48, name: 'الفتح', englishName: 'Al-Fath', englishTranslation: 'The Victory', revelationType: 'Medinan', numberOfAyahs: 29 },
      { number: 49, name: 'الحجرات', englishName: 'Al-Hujurat', englishTranslation: 'The Rooms', revelationType: 'Medinan', numberOfAyahs: 18 },
      { number: 50, name: 'ق', englishName: 'Qaf', englishTranslation: 'The Letter Qaf', revelationType: 'Meccan', numberOfAyahs: 45 },
      { number: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat', englishTranslation: 'The Winnowing Winds', revelationType: 'Meccan', numberOfAyahs: 60 },
      { number: 52, name: 'الطور', englishName: 'At-Tur', englishTranslation: 'The Mount', revelationType: 'Meccan', numberOfAyahs: 49 },
      { number: 53, name: 'النجم', englishName: 'An-Najm', englishTranslation: 'The Star', revelationType: 'Meccan', numberOfAyahs: 62 },
      { number: 54, name: 'القمر', englishName: 'Al-Qamar', englishTranslation: 'The Moon', revelationType: 'Meccan', numberOfAyahs: 55 },
      { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', englishTranslation: 'The Beneficent', revelationType: 'Medinan', numberOfAyahs: 78 },
      { number: 56, name: 'الواقعة', englishName: 'Al-Waqi\'ah', englishTranslation: 'The Inevitable', revelationType: 'Meccan', numberOfAyahs: 96 },
      { number: 57, name: 'الحديد', englishName: 'Al-Hadid', englishTranslation: 'The Iron', revelationType: 'Medinan', numberOfAyahs: 29 },
      { number: 58, name: 'المجادلة', englishName: 'Al-Mujadila', englishTranslation: 'The Pleading Woman', revelationType: 'Medinan', numberOfAyahs: 22 },
      { number: 59, name: 'الحشر', englishName: 'Al-Hashr', englishTranslation: 'The Exile', revelationType: 'Medinan', numberOfAyahs: 24 },
      { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah', englishTranslation: 'She that is to be examined', revelationType: 'Medinan', numberOfAyahs: 13 },
      { number: 61, name: 'الصف', englishName: 'As-Saf', englishTranslation: 'The Ranks', revelationType: 'Medinan', numberOfAyahs: 14 },
      { number: 62, name: 'الجمعة', englishName: 'Al-Jumu\'ah', englishTranslation: 'Friday', revelationType: 'Medinan', numberOfAyahs: 11 },
      { number: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', englishTranslation: 'The Hypocrites', revelationType: 'Medinan', numberOfAyahs: 11 },
      { number: 64, name: 'التغابن', englishName: 'At-Taghabun', englishTranslation: 'The Mutual Disillusion', revelationType: 'Medinan', numberOfAyahs: 18 },
      { number: 65, name: 'الطلاق', englishName: 'At-Talaq', englishTranslation: 'The Divorce', revelationType: 'Medinan', numberOfAyahs: 12 },
      { number: 66, name: 'التحريم', englishName: 'At-Tahrim', englishTranslation: 'The Prohibition', revelationType: 'Medinan', numberOfAyahs: 12 },
      { number: 67, name: 'الملك', englishName: 'Al-Mulk', englishTranslation: 'The Sovereignty', revelationType: 'Meccan', numberOfAyahs: 30 },
      { number: 68, name: 'القلم', englishName: 'Al-Qalam', englishTranslation: 'The Pen', revelationType: 'Meccan', numberOfAyahs: 52 },
      { number: 69, name: 'الحاقة', englishName: 'Al-Haqqah', englishTranslation: 'The Reality', revelationType: 'Meccan', numberOfAyahs: 52 },
      { number: 70, name: 'المعارج', englishName: 'Al-Ma\'arij', englishTranslation: 'The Ascending Stairways', revelationType: 'Meccan', numberOfAyahs: 44 },
      { number: 71, name: 'نوح', englishName: 'Nuh', englishTranslation: 'Noah', revelationType: 'Meccan', numberOfAyahs: 28 },
      { number: 72, name: 'الجن', englishName: 'Al-Jinn', englishTranslation: 'The Jinn', revelationType: 'Meccan', numberOfAyahs: 28 },
      { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', englishTranslation: 'The Enshrouded One', revelationType: 'Meccan', numberOfAyahs: 20 },
      { number: 74, name: 'المدثر', englishName: 'Al-Muddaththir', englishTranslation: 'The Cloaked One', revelationType: 'Meccan', numberOfAyahs: 56 },
      { number: 75, name: 'القيامة', englishName: 'Al-Qiyamah', englishTranslation: 'The Resurrection', revelationType: 'Meccan', numberOfAyahs: 40 },
      { number: 76, name: 'الانسان', englishName: 'Al-Insan', englishTranslation: 'The Man', revelationType: 'Medinan', numberOfAyahs: 31 },
      { number: 77, name: 'المرسلات', englishName: 'Al-Mursalat', englishTranslation: 'The Emissaries', revelationType: 'Meccan', numberOfAyahs: 50 },
      { number: 78, name: 'النبإ', englishName: 'An-Naba', englishTranslation: 'The Tidings', revelationType: 'Meccan', numberOfAyahs: 40 },
      { number: 79, name: 'النازعات', englishName: 'An-Nazi\'at', englishTranslation: 'Those who drag forth', revelationType: 'Meccan', numberOfAyahs: 46 },
      { number: 80, name: 'عبس', englishName: 'Abasa', englishTranslation: 'He Frowned', revelationType: 'Meccan', numberOfAyahs: 42 },
      { number: 81, name: 'التكوير', englishName: 'At-Takwir', englishTranslation: 'The Overthrowing', revelationType: 'Meccan', numberOfAyahs: 29 },
      { number: 82, name: 'الإنفطار', englishName: 'Al-Infitar', englishTranslation: 'The Cleaving', revelationType: 'Meccan', numberOfAyahs: 19 },
      { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', englishTranslation: 'The Defrauding', revelationType: 'Meccan', numberOfAyahs: 36 },
      { number: 84, name: 'الإنشقاق', englishName: 'Al-Inshiqaq', englishTranslation: 'The Sundering', revelationType: 'Meccan', numberOfAyahs: 25 },
      { number: 85, name: 'البروج', englishName: 'Al-Buruj', englishTranslation: 'The Mansions of the Stars', revelationType: 'Meccan', numberOfAyahs: 22 },
      { number: 86, name: 'الطارق', englishName: 'At-Tariq', englishTranslation: 'The Nightcommer', revelationType: 'Meccan', numberOfAyahs: 17 },
      { number: 87, name: 'الأعلى', englishName: 'Al-A\'la', englishTranslation: 'The Most High', revelationType: 'Meccan', numberOfAyahs: 19 },
      { number: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah', englishTranslation: 'The Overwhelming', revelationType: 'Meccan', numberOfAyahs: 26 },
      { number: 89, name: 'الفجر', englishName: 'Al-Fajr', englishTranslation: 'The Dawn', revelationType: 'Meccan', numberOfAyahs: 30 },
      { number: 90, name: 'البلد', englishName: 'Al-Balad', englishTranslation: 'The City', revelationType: 'Meccan', numberOfAyahs: 20 },
      { number: 91, name: 'الشمس', englishName: 'Ash-Shams', englishTranslation: 'The Sun', revelationType: 'Meccan', numberOfAyahs: 15 },
      { number: 92, name: 'الليل', englishName: 'Al-Layl', englishTranslation: 'The Night', revelationType: 'Meccan', numberOfAyahs: 21 },
      { number: 93, name: 'الضحى', englishName: 'Ad-Duhaa', englishTranslation: 'The Morning Hours', revelationType: 'Meccan', numberOfAyahs: 11 },
      { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', englishTranslation: 'The Relief', revelationType: 'Meccan', numberOfAyahs: 8 },
      { number: 95, name: 'التين', englishName: 'At-Tin', englishTranslation: 'The Fig', revelationType: 'Meccan', numberOfAyahs: 8 },
      { number: 96, name: 'العلق', englishName: 'Al-Alaq', englishTranslation: 'The Clot', revelationType: 'Meccan', numberOfAyahs: 19 },
      { number: 97, name: 'القدر', englishName: 'Al-Qadr', englishTranslation: 'The Power', revelationType: 'Meccan', numberOfAyahs: 5 },
      { number: 98, name: 'البينة', englishName: 'Al-Bayyinah', englishTranslation: 'The Clear Proof', revelationType: 'Medinan', numberOfAyahs: 8 },
      { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', englishTranslation: 'The Earthquake', revelationType: 'Medinan', numberOfAyahs: 8 },
      { number: 100, name: 'العاديات', englishName: 'Al-Adiyat', englishTranslation: 'The Courser', revelationType: 'Meccan', numberOfAyahs: 11 },
      { number: 101, name: 'القارعة', englishName: 'Al-Qari\'ah', englishTranslation: 'The Calamity', revelationType: 'Meccan', numberOfAyahs: 11 },
      { number: 102, name: 'التكاثر', englishName: 'At-Takathur', englishTranslation: 'The Rivalry in world increase', revelationType: 'Meccan', numberOfAyahs: 8 },
      { number: 103, name: 'العصر', englishName: 'Al-Asr', englishTranslation: 'The Declining Day', revelationType: 'Meccan', numberOfAyahs: 3 },
      { number: 104, name: 'الهمزة', englishName: 'Al-Humazah', englishTranslation: 'The Traducer', revelationType: 'Meccan', numberOfAyahs: 9 },
      { number: 105, name: 'الفيل', englishName: 'Al-Fil', englishTranslation: 'The Elephant', revelationType: 'Meccan', numberOfAyahs: 5 },
      { number: 106, name: 'قريش', englishName: 'Quraysh', englishTranslation: 'Quraysh', revelationType: 'Meccan', numberOfAyahs: 4 },
      { number: 107, name: 'الماعون', englishName: 'Al-Ma\'un', englishTranslation: 'The Small kindnesses', revelationType: 'Meccan', numberOfAyahs: 7 },
      { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', englishTranslation: 'The Abundance', revelationType: 'Meccan', numberOfAyahs: 3 },
      { number: 109, name: 'الكافرون', englishName: 'Al-Kafirun', englishTranslation: 'The Disbelievers', revelationType: 'Meccan', numberOfAyahs: 6 },
      { number: 110, name: 'النصر', englishName: 'An-Nasr', englishTranslation: 'The Divine Support', revelationType: 'Medinan', numberOfAyahs: 3 },
      { number: 111, name: 'المسد', englishName: 'Al-Masad', englishTranslation: 'The Palm Fiber', revelationType: 'Meccan', numberOfAyahs: 5 },
      { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', englishTranslation: 'The Sincerity', revelationType: 'Meccan', numberOfAyahs: 4 },
      { number: 113, name: 'الفلق', englishName: 'Al-Falaq', englishTranslation: 'The Daybreak', revelationType: 'Meccan', numberOfAyahs: 5 },
      { number: 114, name: 'الناس', englishName: 'An-Nas', englishTranslation: 'Mankind', revelationType: 'Meccan', numberOfAyahs: 6 }
    ];

    // Insert all surahs
    await Surah.insertMany(surahs);
    console.log(`✅ Added all ${surahs.length} Surahs to the database\n`);

    console.log('🎉 COMPLETE!');
    console.log('\n📋 Quran Al-Kareem Statistics:');
    console.log(`   Total Surahs: ${surahs.length}`);
    console.log(`   Meccan Surahs: ${surahs.filter(s => s.revelationType === 'Meccan').length}`);
    console.log(`   Medinan Surahs: ${surahs.filter(s => s.revelationType === 'Medinan').length}`);
    console.log(`   Total Ayahs: ${surahs.reduce((sum, s) => sum + s.numberOfAyahs, 0)}`);
    console.log('\n🌐 View at: http://localhost:3001/quran');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

populateQuran();
