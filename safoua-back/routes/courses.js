const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  unenrollCourse,
  uploadCourseThumbnail,
  getTeacherStudents,
  getCourseAnalytics,
  getUserEnrollment,
  getMyEnrollments,
  getMyCourses
} = require('../controllers/courseController');
const { protect, authorize, checkTeacherApproved } = require('../middleware/auth');
const { courseValidation, validate, idValidation } = require('../middleware/validation');
const { uploadImage } = require('../middleware/upload');

// Teacher-specific routes
router.get('/teacher/students', protect, authorize('teacher', 'admin'), checkTeacherApproved, getTeacherStudents);
router.get('/my-courses', protect, authorize('teacher', 'admin'), getMyCourses);

// Enrollment routes
router.get('/enrollments/my-enrollments', protect, getMyEnrollments);
router.get('/enrollments/course/:courseId', protect, getUserEnrollment);

// Public routes
router.get('/', getCourses);
router.get('/:id', idValidation, validate, getCourse);

// Course analytics (must be before /:id routes)
router.get('/:id/analytics', protect, authorize('teacher', 'admin'), idValidation, validate, getCourseAnalytics);

// Protected routes
router.post('/', protect, authorize('teacher', 'admin'), checkTeacherApproved, courseValidation, validate, createCourse);
router.put('/:id', protect, authorize('teacher', 'admin'), idValidation, validate, updateCourse);
router.delete('/:id', protect, authorize('teacher', 'admin'), idValidation, validate, deleteCourse);
router.post('/:id/enroll', protect, idValidation, validate, enrollCourse);
router.post('/:id/unenroll', protect, idValidation, validate, unenrollCourse);
router.post('/:id/thumbnail', protect, authorize('teacher', 'admin'), uploadImage, uploadCourseThumbnail);

module.exports = router;
