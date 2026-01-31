const mongoose = require('mongoose');

const ayahSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  translation: {
    type: String
  },
  audioUrl: String
});

const surahSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  englishName: {
    type: String,
    required: true
  },
  revelationType: {
    type: String,
    enum: ['Meccan', 'Medinan'],
    required: true
  },
  numberOfAyahs: {
    type: Number,
    required: true
  },
  ayahs: [ayahSchema]
}, {
  timestamps: true
});

const recitationSubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  surah: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Surah',
    required: true
  },
  ayahFrom: Number,
  ayahTo: Number,
  audioUrl: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  feedback: String,
  grade: {
    type: String,
    enum: ['Excellent', 'Good', 'Needs Improvement', 'Pending'],
    default: 'Pending'
  },
  tajweedNotes: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date
}, {
  timestamps: true
});

const tajweedRuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  arabicTitle: String,
  description: {
    type: String,
    required: true
  },
  examples: [String],
  category: {
    type: String,
    enum: ['Noon Sakinah', 'Meem Sakinah', 'Qalqalah', 'Madd', 'Other']
  }
}, {
  timestamps: true
});

const Surah = mongoose.model('Surah', surahSchema);
const RecitationSubmission = mongoose.model('RecitationSubmission', recitationSubmissionSchema);
const TajweedRule = mongoose.model('TajweedRule', tajweedRuleSchema);

module.exports = { Surah, RecitationSubmission, TajweedRule };
