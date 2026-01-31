const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'fill-blank'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [String],
  correctAnswer: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 1
  }
});

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an assessment title'],
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  type: {
    type: String,
    enum: ['quiz', 'assignment', 'exam'],
    required: true
  },
  description: String,
  questions: [questionSchema],
  totalPoints: {
    type: Number,
    default: 0
  },
  passingScore: {
    type: Number,
    default: 70
  },
  timeLimit: {
    type: Number,
    default: 0
  },
  dueDate: Date,
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const submissionSchema = new mongoose.Schema({
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    answer: String
  }],
  fileUrl: String,
  score: {
    type: Number,
    default: 0
  },
  feedback: String,
  status: {
    type: String,
    enum: ['pending', 'graded', 'late'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  gradedAt: Date,
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient querying
submissionSchema.index({ assessment: 1, student: 1 });

const Assessment = mongoose.model('Assessment', assessmentSchema);
const Submission = mongoose.model('Submission', submissionSchema);

module.exports = { Assessment, Submission };
