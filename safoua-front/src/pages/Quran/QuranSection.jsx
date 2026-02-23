import { useState, useEffect, useRef } from 'react';
import { FaBook, FaPlay, FaPause, FaSearch, FaBookmark, FaVolumeUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';

const QuranSection = () => {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [fontSize, setFontSize] = useState('text-2xl');
  const [playingVerse, setPlayingVerse] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/quran/surahs');
      setSurahs(response.data.data || []);
      
      // Select first surah by default
      if (response.data.data && response.data.data.length > 0) {
        selectSurah(response.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching surahs:', error);
      toast.error('Failed to load Quran data');
      // Use fallback data if API fails
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackData = () => {
    // Complete list of all 114 Surahs of the Quran
    const fallbackSurahs = [
      { number: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', revelationType: 'Meccan', numberOfAyahs: 7 },
      { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', revelationType: 'Medinan', numberOfAyahs: 286 },
      { number: 3, name: 'آل عمران', englishName: 'Ali \'Imran', revelationType: 'Medinan', numberOfAyahs: 200 },
      { number: 4, name: 'النساء', englishName: 'An-Nisa', revelationType: 'Medinan', numberOfAyahs: 176 },
      { number: 5, name: 'المائدة', englishName: 'Al-Ma\'idah', revelationType: 'Medinan', numberOfAyahs: 120 },
      { number: 6, name: 'الأنعام', englishName: 'Al-An\'am', revelationType: 'Meccan', numberOfAyahs: 165 },
      { number: 7, name: 'الأعراف', englishName: 'Al-A\'raf', revelationType: 'Meccan', numberOfAyahs: 206 },
      { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', revelationType: 'Medinan', numberOfAyahs: 75 },
      { number: 9, name: 'التوبة', englishName: 'At-Tawbah', revelationType: 'Medinan', numberOfAyahs: 129 },
      { number: 10, name: 'يونس', englishName: 'Yunus', revelationType: 'Meccan', numberOfAyahs: 109 },
      { number: 11, name: 'هود', englishName: 'Hud', revelationType: 'Meccan', numberOfAyahs: 123 },
      { number: 12, name: 'يوسف', englishName: 'Yusuf', revelationType: 'Meccan', numberOfAyahs: 111 },
      { number: 13, name: 'الرعد', englishName: 'Ar-Ra\'d', revelationType: 'Medinan', numberOfAyahs: 43 },
      { number: 14, name: 'ابراهيم', englishName: 'Ibrahim', revelationType: 'Meccan', numberOfAyahs: 52 },
      { number: 15, name: 'الحجر', englishName: 'Al-Hijr', revelationType: 'Meccan', numberOfAyahs: 99 },
      { number: 16, name: 'النحل', englishName: 'An-Nahl', revelationType: 'Meccan', numberOfAyahs: 128 },
      { number: 17, name: 'الإسراء', englishName: 'Al-Isra', revelationType: 'Meccan', numberOfAyahs: 111 },
      { number: 18, name: 'الكهف', englishName: 'Al-Kahf', revelationType: 'Meccan', numberOfAyahs: 110 },
      { number: 19, name: 'مريم', englishName: 'Maryam', revelationType: 'Meccan', numberOfAyahs: 98 },
      { number: 20, name: 'طه', englishName: 'Taha', revelationType: 'Meccan', numberOfAyahs: 135 },
      { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', revelationType: 'Meccan', numberOfAyahs: 112 },
      { number: 22, name: 'الحج', englishName: 'Al-Hajj', revelationType: 'Medinan', numberOfAyahs: 78 },
      { number: 23, name: 'المؤمنون', englishName: 'Al-Mu\'minun', revelationType: 'Meccan', numberOfAyahs: 118 },
      { number: 24, name: 'النور', englishName: 'An-Nur', revelationType: 'Medinan', numberOfAyahs: 64 },
      { number: 25, name: 'الفرقان', englishName: 'Al-Furqan', revelationType: 'Meccan', numberOfAyahs: 77 },
      { number: 26, name: 'الشعراء', englishName: 'Ash-Shu\'ara', revelationType: 'Meccan', numberOfAyahs: 227 },
      { number: 27, name: 'النمل', englishName: 'An-Naml', revelationType: 'Meccan', numberOfAyahs: 93 },
      { number: 28, name: 'القصص', englishName: 'Al-Qasas', revelationType: 'Meccan', numberOfAyahs: 88 },
      { number: 29, name: 'العنكبوت', englishName: 'Al-Ankabut', revelationType: 'Meccan', numberOfAyahs: 69 },
      { number: 30, name: 'الروم', englishName: 'Ar-Rum', revelationType: 'Meccan', numberOfAyahs: 60 },
      { number: 31, name: 'لقمان', englishName: 'Luqman', revelationType: 'Meccan', numberOfAyahs: 34 },
      { number: 32, name: 'السجدة', englishName: 'As-Sajdah', revelationType: 'Meccan', numberOfAyahs: 30 },
      { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', revelationType: 'Medinan', numberOfAyahs: 73 },
      { number: 34, name: 'سبإ', englishName: 'Saba', revelationType: 'Meccan', numberOfAyahs: 54 },
      { number: 35, name: 'فاطر', englishName: 'Fatir', revelationType: 'Meccan', numberOfAyahs: 45 },
      { number: 36, name: 'يس', englishName: 'Ya-Sin', revelationType: 'Meccan', numberOfAyahs: 83 },
      { number: 37, name: 'الصافات', englishName: 'As-Saffat', revelationType: 'Meccan', numberOfAyahs: 182 },
      { number: 38, name: 'ص', englishName: 'Sad', revelationType: 'Meccan', numberOfAyahs: 88 },
      { number: 39, name: 'الزمر', englishName: 'Az-Zumar', revelationType: 'Meccan', numberOfAyahs: 75 },
      { number: 40, name: 'غافر', englishName: 'Ghafir', revelationType: 'Meccan', numberOfAyahs: 85 },
      { number: 41, name: 'فصلت', englishName: 'Fussilat', revelationType: 'Meccan', numberOfAyahs: 54 },
      { number: 42, name: 'الشورى', englishName: 'Ash-Shuraa', revelationType: 'Meccan', numberOfAyahs: 53 },
      { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', revelationType: 'Meccan', numberOfAyahs: 89 },
      { number: 44, name: 'الدخان', englishName: 'Ad-Dukhan', revelationType: 'Meccan', numberOfAyahs: 59 },
      { number: 45, name: 'الجاثية', englishName: 'Al-Jathiyah', revelationType: 'Meccan', numberOfAyahs: 37 },
      { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', revelationType: 'Meccan', numberOfAyahs: 35 },
      { number: 47, name: 'محمد', englishName: 'Muhammad', revelationType: 'Medinan', numberOfAyahs: 38 },
      { number: 48, name: 'الفتح', englishName: 'Al-Fath', revelationType: 'Medinan', numberOfAyahs: 29 },
      { number: 49, name: 'الحجرات', englishName: 'Al-Hujurat', revelationType: 'Medinan', numberOfAyahs: 18 },
      { number: 50, name: 'ق', englishName: 'Qaf', revelationType: 'Meccan', numberOfAyahs: 45 },
      { number: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat', revelationType: 'Meccan', numberOfAyahs: 60 },
      { number: 52, name: 'الطور', englishName: 'At-Tur', revelationType: 'Meccan', numberOfAyahs: 49 },
      { number: 53, name: 'النجم', englishName: 'An-Najm', revelationType: 'Meccan', numberOfAyahs: 62 },
      { number: 54, name: 'القمر', englishName: 'Al-Qamar', revelationType: 'Meccan', numberOfAyahs: 55 },
      { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', revelationType: 'Medinan', numberOfAyahs: 78 },
      { number: 56, name: 'الواقعة', englishName: 'Al-Waqi\'ah', revelationType: 'Meccan', numberOfAyahs: 96 },
      { number: 57, name: 'الحديد', englishName: 'Al-Hadid', revelationType: 'Medinan', numberOfAyahs: 29 },
      { number: 58, name: 'المجادلة', englishName: 'Al-Mujadila', revelationType: 'Medinan', numberOfAyahs: 22 },
      { number: 59, name: 'الحشر', englishName: 'Al-Hashr', revelationType: 'Medinan', numberOfAyahs: 24 },
      { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah', revelationType: 'Medinan', numberOfAyahs: 13 },
      { number: 61, name: 'الصف', englishName: 'As-Saf', revelationType: 'Medinan', numberOfAyahs: 14 },
      { number: 62, name: 'الجمعة', englishName: 'Al-Jumu\'ah', revelationType: 'Medinan', numberOfAyahs: 11 },
      { number: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', revelationType: 'Medinan', numberOfAyahs: 11 },
      { number: 64, name: 'التغابن', englishName: 'At-Taghabun', revelationType: 'Medinan', numberOfAyahs: 18 },
      { number: 65, name: 'الطلاق', englishName: 'At-Talaq', revelationType: 'Medinan', numberOfAyahs: 12 },
      { number: 66, name: 'التحريم', englishName: 'At-Tahrim', revelationType: 'Medinan', numberOfAyahs: 12 },
      { number: 67, name: 'الملك', englishName: 'Al-Mulk', revelationType: 'Meccan', numberOfAyahs: 30 },
      { number: 68, name: 'القلم', englishName: 'Al-Qalam', revelationType: 'Meccan', numberOfAyahs: 52 },
      { number: 69, name: 'الحاقة', englishName: 'Al-Haqqah', revelationType: 'Meccan', numberOfAyahs: 52 },
      { number: 70, name: 'المعارج', englishName: 'Al-Ma\'arij', revelationType: 'Meccan', numberOfAyahs: 44 },
      { number: 71, name: 'نوح', englishName: 'Nuh', revelationType: 'Meccan', numberOfAyahs: 28 },
      { number: 72, name: 'الجن', englishName: 'Al-Jinn', revelationType: 'Meccan', numberOfAyahs: 28 },
      { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', revelationType: 'Meccan', numberOfAyahs: 20 },
      { number: 74, name: 'المدثر', englishName: 'Al-Muddaththir', revelationType: 'Meccan', numberOfAyahs: 56 },
      { number: 75, name: 'القيامة', englishName: 'Al-Qiyamah', revelationType: 'Meccan', numberOfAyahs: 40 },
      { number: 76, name: 'الانسان', englishName: 'Al-Insan', revelationType: 'Medinan', numberOfAyahs: 31 },
      { number: 77, name: 'المرسلات', englishName: 'Al-Mursalat', revelationType: 'Meccan', numberOfAyahs: 50 },
      { number: 78, name: 'النبإ', englishName: 'An-Naba', revelationType: 'Meccan', numberOfAyahs: 40 },
      { number: 79, name: 'النازعات', englishName: 'An-Nazi\'at', revelationType: 'Meccan', numberOfAyahs: 46 },
      { number: 80, name: 'عبس', englishName: 'Abasa', revelationType: 'Meccan', numberOfAyahs: 42 },
      { number: 81, name: 'التكوير', englishName: 'At-Takwir', revelationType: 'Meccan', numberOfAyahs: 29 },
      { number: 82, name: 'الإنفطار', englishName: 'Al-Infitar', revelationType: 'Meccan', numberOfAyahs: 19 },
      { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', revelationType: 'Meccan', numberOfAyahs: 36 },
      { number: 84, name: 'الإنشقاق', englishName: 'Al-Inshiqaq', revelationType: 'Meccan', numberOfAyahs: 25 },
      { number: 85, name: 'البروج', englishName: 'Al-Buruj', revelationType: 'Meccan', numberOfAyahs: 22 },
      { number: 86, name: 'الطارق', englishName: 'At-Tariq', revelationType: 'Meccan', numberOfAyahs: 17 },
      { number: 87, name: 'الأعلى', englishName: 'Al-A\'la', revelationType: 'Meccan', numberOfAyahs: 19 },
      { number: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah', revelationType: 'Meccan', numberOfAyahs: 26 },
      { number: 89, name: 'الفجر', englishName: 'Al-Fajr', revelationType: 'Meccan', numberOfAyahs: 30 },
      { number: 90, name: 'البلد', englishName: 'Al-Balad', revelationType: 'Meccan', numberOfAyahs: 20 },
      { number: 91, name: 'الشمس', englishName: 'Ash-Shams', revelationType: 'Meccan', numberOfAyahs: 15 },
      { number: 92, name: 'الليل', englishName: 'Al-Layl', revelationType: 'Meccan', numberOfAyahs: 21 },
      { number: 93, name: 'الضحى', englishName: 'Ad-Duhaa', revelationType: 'Meccan', numberOfAyahs: 11 },
      { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', revelationType: 'Meccan', numberOfAyahs: 8 },
      { number: 95, name: 'التين', englishName: 'At-Tin', revelationType: 'Meccan', numberOfAyahs: 8 },
      { number: 96, name: 'العلق', englishName: 'Al-Alaq', revelationType: 'Meccan', numberOfAyahs: 19 },
      { number: 97, name: 'القدر', englishName: 'Al-Qadr', revelationType: 'Meccan', numberOfAyahs: 5 },
      { number: 98, name: 'البينة', englishName: 'Al-Bayyinah', revelationType: 'Medinan', numberOfAyahs: 8 },
      { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', revelationType: 'Medinan', numberOfAyahs: 8 },
      { number: 100, name: 'العاديات', englishName: 'Al-Adiyat', revelationType: 'Meccan', numberOfAyahs: 11 },
      { number: 101, name: 'القارعة', englishName: 'Al-Qari\'ah', revelationType: 'Meccan', numberOfAyahs: 11 },
      { number: 102, name: 'التكاثر', englishName: 'At-Takathur', revelationType: 'Meccan', numberOfAyahs: 8 },
      { number: 103, name: 'العصر', englishName: 'Al-Asr', revelationType: 'Meccan', numberOfAyahs: 3 },
      { number: 104, name: 'الهمزة', englishName: 'Al-Humazah', revelationType: 'Meccan', numberOfAyahs: 9 },
      { number: 105, name: 'الفيل', englishName: 'Al-Fil', revelationType: 'Meccan', numberOfAyahs: 5 },
      { number: 106, name: 'قريش', englishName: 'Quraysh', revelationType: 'Meccan', numberOfAyahs: 4 },
      { number: 107, name: 'الماعون', englishName: 'Al-Ma\'un', revelationType: 'Meccan', numberOfAyahs: 7 },
      { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', revelationType: 'Meccan', numberOfAyahs: 3 },
      { number: 109, name: 'الكافرون', englishName: 'Al-Kafirun', revelationType: 'Meccan', numberOfAyahs: 6 },
      { number: 110, name: 'النصر', englishName: 'An-Nasr', revelationType: 'Medinan', numberOfAyahs: 3 },
      { number: 111, name: 'المسد', englishName: 'Al-Masad', revelationType: 'Meccan', numberOfAyahs: 5 },
      { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', revelationType: 'Meccan', numberOfAyahs: 4 },
      { number: 113, name: 'الفلق', englishName: 'Al-Falaq', revelationType: 'Meccan', numberOfAyahs: 5 },
      { number: 114, name: 'الناس', englishName: 'An-Nas', revelationType: 'Meccan', numberOfAyahs: 6 }
    ];
    setSurahs(fallbackSurahs);
    if (fallbackSurahs.length > 0) {
      selectSurah(fallbackSurahs[0]);
    }
  };

  const selectSurah = async (surah) => {
    setSelectedSurah(surah);
    stopAudio(); // Stop any playing audio when switching surahs
    
    try {
      const response = await api.get(`/quran/surah/${surah.number}`);
      const surahData = response.data.data;
      setVerses(surahData.ayahs || []);
    } catch (error) {
      console.error('Error fetching verses:', error);
      // Load sample verses for Al-Fatihah
      if (surah.number === 1) {
        loadSampleVerses();
      } else {
        toast.error('Failed to load verses');
      }
    }
  };

  const playAudio = (verse) => {
    if (!verse.audioUrl) {
      toast.error('Audio not available for this verse');
      return;
    }

    // If same verse is playing, pause it
    if (playingVerse === verse.number && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setPlayingVerse(null);
      return;
    }

    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Create new audio element
    audioRef.current = new Audio(verse.audioUrl);
    audioRef.current.play()
      .then(() => {
        setPlayingVerse(verse.number);
      })
      .catch((error) => {
        console.error('Error playing audio:', error);
        toast.error('Failed to play audio');
      });

    // Reset playing state when audio ends
    audioRef.current.onended = () => {
      setPlayingVerse(null);
    };
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingVerse(null);
  };

  const loadSampleVerses = () => {
    const sampleVerses = [
      {
        number: 1,
        text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        transliteration: 'Bismillahir Rahmanir Raheem'
      },
      {
        number: 2,
        text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        translation: 'All praise is due to Allah, Lord of the worlds.',
        transliteration: 'Alhamdu lillahi rabbil \'alameen'
      },
      {
        number: 3,
        text: 'الرَّحْمَٰنِ الرَّحِيمِ',
        translation: 'The Entirely Merciful, the Especially Merciful,',
        transliteration: 'Ar-Rahmanir-Raheem'
      },
      {
        number: 4,
        text: 'مَالِكِ يَوْمِ الدِّينِ',
        translation: 'Sovereign of the Day of Recompense.',
        transliteration: 'Maliki yawmid-deen'
      },
      {
        number: 5,
        text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        translation: 'It is You we worship and You we ask for help.',
        transliteration: 'Iyyaka na\'budu wa iyyaka nasta\'een'
      },
      {
        number: 6,
        text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        translation: 'Guide us to the straight path -',
        transliteration: 'Ihdinas-siratal-mustaqeem'
      },
      {
        number: 7,
        text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        translation: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
        transliteration: 'Siratal-lazeena an\'amta \'alaihim ghayril-maghdubi \'alaihim wa lad-dalleen'
      }
    ];
    setVerses(sampleVerses);
  };

  const filteredSurahs = surahs.filter(surah =>
    surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.number.toString().includes(searchTerm)
  );

  const goToNextSurah = () => {
    if (selectedSurah && selectedSurah.number < surahs.length) {
      const nextSurah = surahs.find(s => s.number === selectedSurah.number + 1);
      if (nextSurah) selectSurah(nextSurah);
    }
  };

  const goToPreviousSurah = () => {
    if (selectedSurah && selectedSurah.number > 1) {
      const prevSurah = surahs.find(s => s.number === selectedSurah.number - 1);
      if (prevSurah) selectSurah(prevSurah);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Quran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 arabic-text">القرآن الكريم</h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-2">Al-Quran Al-Kareem</p>
            <p className="text-primary-200">The Noble Quran</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Surah List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-4">
              <div className="p-4 border-b">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold arabic-text text-primary-700 mb-1">السور</h2>
                  <p className="text-sm text-gray-600">Surahs</p>
                </div>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search surah..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
                  />
                </div>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                {filteredSurahs.map((surah) => (
                  <button
                    key={surah.number}
                    onClick={() => selectSurah(surah)}
                    className={`w-full text-left p-4 border-b hover:bg-gray-50 transition ${
                      selectedSurah?.number === surah.number ? 'bg-primary-50 border-l-4 border-l-primary-600' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                          {surah.number}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{surah.englishName}</p>
                          <p className="text-sm text-gray-600 arabic-text">{surah.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{surah.numberOfAyahs} آيات</p>
                        <p className="text-xs text-gray-400">{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Verses */}
          <div className="lg:col-span-3">
            {selectedSurah ? (
              <div className="space-y-6">
                {/* Surah Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="text-center mb-6">
                    <h2 className="text-4xl font-bold arabic-text text-primary-700 mb-2">
                      {selectedSurah.name}
                    </h2>
                    <p className="text-xl text-gray-700 font-semibold mb-1">
                      {selectedSurah.englishName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {selectedSurah.numberOfAyahs} آية
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-4 pt-4 border-t">
                    <div className="flex space-x-2">
                      <button
                        onClick={goToPreviousSurah}
                        disabled={selectedSurah.number === 1}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-2"
                        title="Previous Surah"
                      >
                        <FaChevronLeft className="w-4 h-4" />
                        <span className="text-sm">Previous</span>
                      </button>
                      <button
                        onClick={goToNextSurah}
                        disabled={selectedSurah.number === surahs.length}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-2"
                        title="Next Surah"
                      >
                        <span className="text-sm">Next</span>
                        <FaChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showTranslation}
                        onChange={(e) => setShowTranslation(e.target.checked)}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Show Translation</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showTransliteration}
                        onChange={(e) => setShowTransliteration(e.target.checked)}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Show Transliteration</span>
                    </label>

                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="text-xl">Small</option>
                      <option value="text-2xl">Medium</option>
                      <option value="text-3xl">Large</option>
                      <option value="text-4xl">Extra Large</option>
                    </select>
                  </div>
                </div>

                {/* Bismillah */}
                {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="arabic-text text-3xl text-gray-800">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                    <p className="text-gray-600 mt-2 text-sm">
                      In the name of Allah, the Entirely Merciful, the Especially Merciful
                    </p>
                  </div>
                )}

                {/* Verses */}
                <div className="space-y-4">
                  {verses.map((verse) => (
                    <div key={verse.number} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">{verse.number}</span>
                          </div>
                        </div>

                        <div className="flex-1 space-y-3">
                          {/* Arabic Text */}
                          <p className={`arabic-text ${fontSize} leading-loose text-gray-900 text-right`}>
                            {verse.text}
                          </p>

                          {/* Transliteration */}
                          {showTransliteration && verse.transliteration && (
                            <p className="text-gray-600 italic text-sm border-l-2 border-gray-300 pl-4">
                              {verse.transliteration}
                            </p>
                          )}

                          {/* Translation */}
                          {showTranslation && verse.translation && (
                            <p className="text-gray-700 leading-relaxed border-l-2 border-primary-300 pl-4">
                              {verse.translation}
                            </p>
                          )}

                          {/* Actions */}
                          <div className="flex items-center space-x-4 pt-2">
                            <button
                              onClick={() => playAudio(verse)}
                              className={`transition text-sm flex items-center space-x-1 ${
                                playingVerse === verse.number 
                                  ? 'text-primary-600 hover:text-primary-700' 
                                  : 'text-gray-500 hover:text-primary-600'
                              }`}
                              title={playingVerse === verse.number ? 'Pause Audio' : 'Play Audio'}
                            >
                              {playingVerse === verse.number ? (
                                <FaPause className="w-4 h-4" />
                              ) : (
                                <FaPlay className="w-4 h-4" />
                              )}
                              <span>{playingVerse === verse.number ? 'Pause' : 'Play'}</span>
                            </button>
                            <button
                              className="text-gray-500 hover:text-primary-600 transition text-sm flex items-center space-x-1"
                              title="Bookmark"
                            >
                              <FaBookmark className="w-4 h-4" />
                              <span>Bookmark</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {verses.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No verses available for this surah.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a surah to start reading</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuranSection;