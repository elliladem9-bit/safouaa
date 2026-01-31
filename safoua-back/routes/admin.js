const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  approveTeacher,
  getPendingTeachers,
  getAnalytics,
  promoteToTeacher,
  applyForTeacher,
  getTeacherApplications,
  respondToTeacherApplication
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { idValidation, validate } = require('../middleware/validation');
const { body } = require('express-validator');

// Validation for teacher application
const teacherApplicationValidation = [
  body('message').optional().isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters'),
  body('qualifications').optional().isLength({ max: 1000 }).withMessage('Qualifications cannot exceed 1000 characters'),
  body('teachingExperience').optional().isLength({ max: 1000 }).withMessage('Teaching experience cannot exceed 1000 characters')
];

// Validation for application response
const applicationResponseValidation = [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('adminResponse').optional().isLength({ max: 500 }).withMessage('Response cannot exceed 500 characters')
];

// Teacher application route (accessible to students)
router.post('/apply-teacher', protect, authorize('student'), teacherApplicationValidation, validate, applyForTeacher);

// All other routes are admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.get('/users/:id', idValidation, validate, getUser);
router.put('/users/:id', idValidation, validate, updateUser);
router.delete('/users/:id', idValidation, validate, deleteUser);
router.put('/users/:id/promote-teacher', idValidation, validate, promoteToTeacher);
router.put('/teachers/:id/approve', idValidation, validate, approveTeacher);
router.get('/teachers/pending', getPendingTeachers);
router.get('/teacher-applications', getTeacherApplications);
router.put('/teacher-applications/:id/respond', idValidation, applicationResponseValidation, validate, respondToTeacherApplication);
router.get('/analytics', getAnalytics);

module.exports = router;
