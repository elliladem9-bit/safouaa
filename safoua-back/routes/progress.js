const express = require('express');
const router = express.Router();
const {
  getProgress,
  updateProgress,
  markLessonComplete
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.get('/course/:courseId', protect, getProgress);
router.put('/course/:courseId', protect, updateProgress);
router.post('/lesson/:lessonId/complete', protect, markLessonComplete);

module.exports = router;
