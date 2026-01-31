const { Surah, RecitationSubmission, TajweedRule } = require('../models/Quran');
const cloudinary = require('../config/cloudinary');

// @desc    Get all surahs
// @route   GET /api/quran/surahs
// @access  Public
exports.getSurahs = async (req, res, next) => {
  try {
    const surahs = await Surah.find().select('-ayahs').sort({ number: 1 });

    res.status(200).json({
      success: true,
      count: surahs.length,
      data: surahs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single surah with ayahs
// @route   GET /api/quran/surahs/:id
// @access  Public
exports.getSurah = async (req, res, next) => {
  try {
    const surah = await Surah.findById(req.params.id);

    if (!surah) {
      return res.status(404).json({ success: false, message: 'Surah not found' });
    }

    res.status(200).json({
      success: true,
      data: surah
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit recitation
// @route   POST /api/quran/recitation/submit
// @access  Private
exports.submitRecitation = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an audio file' });
    }

    const { surah, ayahFrom, ayahTo, teacher } = req.body;

    // Upload to cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'quran-recitations', resource_type: 'video' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const submission = await RecitationSubmission.create({
      student: req.user._id,
      surah,
      ayahFrom,
      ayahTo,
      audioUrl: result.secure_url,
      teacher
    });

    res.status(201).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recitation submissions
// @route   GET /api/quran/recitation/submissions
// @access  Private
exports.getRecitationSubmissions = async (req, res, next) => {
  try {
    const query = req.user.role === 'teacher' 
      ? { teacher: req.user._id }
      : { student: req.user._id };

    const submissions = await RecitationSubmission.find(query)
      .populate('student', 'name email')
      .populate('surah', 'name englishName')
      .populate('teacher', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Review recitation
// @route   PUT /api/quran/recitation/:id/review
// @access  Private (Teacher/Admin)
exports.reviewRecitation = async (req, res, next) => {
  try {
    const { feedback, grade, tajweedNotes } = req.body;

    const submission = await RecitationSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    submission.feedback = feedback;
    submission.grade = grade;
    submission.tajweedNotes = tajweedNotes;
    submission.reviewedAt = Date.now();
    await submission.save();

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tajweed rules
// @route   GET /api/quran/tajweed
// @access  Public
exports.getTajweedRules = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};

    const rules = await TajweedRule.find(query);

    res.status(200).json({
      success: true,
      count: rules.length,
      data: rules
    });
  } catch (error) {
    next(error);
  }
};
