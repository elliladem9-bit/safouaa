const express = require('express');
const router = express.Router();
const {
  getSurahs,
  getSurah,
  submitRecitation,
  getRecitationSubmissions,
  reviewRecitation,
  getTajweedRules
} = require('../controllers/quranController');
const { protect, authorize } = require('../middleware/auth');
const { uploadAudio } = require('../middleware/upload');

router.get('/surahs', getSurahs);
router.get('/surahs/:id', getSurah);
router.post('/recitation/submit', protect, uploadAudio, submitRecitation);
router.get('/recitation/submissions', protect, getRecitationSubmissions);
router.put('/recitation/:id/review', protect, authorize('teacher', 'admin'), reviewRecitation);
router.get('/tajweed', getTajweedRules);

module.exports = router;
