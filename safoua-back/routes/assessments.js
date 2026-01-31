const express = require('express');
const router = express.Router();
const {
  getAssessments,
  getAssessment,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  submitAssessment,
  gradeSubmission,
  getSubmissions
} = require('../controllers/assessmentController');
const { protect, authorize } = require('../middleware/auth');
const { assessmentValidation, validate, idValidation } = require('../middleware/validation');
const { uploadDocument } = require('../middleware/upload');

router.get('/course/:courseId', protect, getAssessments);
router.get('/:id', protect, idValidation, validate, getAssessment);
router.post('/', protect, authorize('teacher', 'admin'), assessmentValidation, validate, createAssessment);
router.put('/:id', protect, authorize('teacher', 'admin'), idValidation, validate, updateAssessment);
router.delete('/:id', protect, authorize('teacher', 'admin'), idValidation, validate, deleteAssessment);
router.post('/:id/submit', protect, uploadDocument, submitAssessment);
router.put('/submission/:id/grade', protect, authorize('teacher', 'admin'), gradeSubmission);
router.get('/:id/submissions', protect, authorize('teacher', 'admin'), getSubmissions);

module.exports = router;
