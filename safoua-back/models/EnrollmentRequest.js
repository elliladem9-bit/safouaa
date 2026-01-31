const mongoose = require('mongoose');

const enrollmentRequestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot be more than 500 characters'],
    default: ''
  },
  teacherResponse: {
    type: String,
    maxlength: [500, 'Response cannot be more than 500 characters'],
    default: ''
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: Date,
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index to ensure unique pending requests
enrollmentRequestSchema.index({ student: 1, course: 1, status: 1 });

// Index for teacher queries
enrollmentRequestSchema.index({ course: 1, status: 1 });

module.exports = mongoose.model('EnrollmentRequest', enrollmentRequestSchema);