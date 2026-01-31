const express = require('express');
const router = express.Router();
const {
  getForumPosts,
  getForumPost,
  createForumPost,
  updateForumPost,
  deleteForumPost,
  addComment,
  togglePin,
  toggleLock
} = require('../controllers/forumController');
const { protect, authorize } = require('../middleware/auth');
const { idValidation, validate } = require('../middleware/validation');

router.get('/course/:courseId', protect, getForumPosts);
router.get('/:id', protect, idValidation, validate, getForumPost);
router.post('/', protect, createForumPost);
router.put('/:id', protect, idValidation, validate, updateForumPost);
router.delete('/:id', protect, idValidation, validate, deleteForumPost);
router.post('/:id/comment', protect, idValidation, validate, addComment);
router.put('/:id/pin', protect, authorize('teacher', 'admin'), idValidation, validate, togglePin);
router.put('/:id/lock', protect, authorize('teacher', 'admin'), idValidation, validate, toggleLock);

module.exports = router;
