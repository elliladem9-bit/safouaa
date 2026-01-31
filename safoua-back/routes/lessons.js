const express = require('express');
const router = express.Router();
const {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
  uploadLessonVideo,
  uploadLessonAudio,
  uploadLessonDocument
} = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/auth');
const { lessonValidation, validate, idValidation } = require('../middleware/validation');
const { uploadVideo, uploadAudio, uploadDocument } = require('../middleware/upload');

router.get('/course/:courseId', getLessons);
router.get('/:id', protect, idValidation, validate, getLesson);
router.post('/', protect, authorize('teacher', 'admin'), lessonValidation, validate, createLesson);
router.put('/:id', protect, authorize('teacher', 'admin'), idValidation, validate, updateLesson);
router.delete('/:id', protect, authorize('teacher', 'admin'), idValidation, validate, deleteLesson);
router.post('/:id/video', protect, authorize('teacher', 'admin'), uploadVideo, uploadLessonVideo);
router.post('/:id/audio', protect, authorize('teacher', 'admin'), uploadAudio, uploadLessonAudio);
router.post('/:id/document', protect, authorize('teacher', 'admin'), uploadDocument, uploadLessonDocument);

module.exports = router;
