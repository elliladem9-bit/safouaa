const express = require('express');
const router = express.Router();
const {
  createEnrollmentRequest,
  getTeacherEnrollmentRequests,
  getStudentEnrollmentRequests,
  respondToEnrollmentRequest,
  cancelEnrollmentRequest
} = require('../controllers/enrollmentRequestController');
const { protect, authorize } = require('../middleware/auth');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validation');

// Validation middleware
const createRequestValidation = [
  body('courseId').isMongoId().withMessage('Valid course ID is required'),
  body('message').optional().isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters')
];

const respondValidation = [
  param('id').isMongoId().withMessage('Valid request ID is required'),
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('teacherResponse').optional().isLength({ max: 500 }).withMessage('Response cannot exceed 500 characters')
];

// All routes require authentication
router.use(protect);

// Student routes
router.post('/', authorize('student'), createRequestValidation, validate, createEnrollmentRequest);
router.get('/student', authorize('student'), getStudentEnrollmentRequests);
router.delete('/:id', authorize('student'), cancelEnrollmentRequest);

// Teacher routes
router.get('/teacher', authorize('teacher', 'admin'), getTeacherEnrollmentRequests);
router.put('/:id/respond', authorize('teacher', 'admin'), respondValidation, validate, respondToEnrollmentRequest);

module.exports = router;