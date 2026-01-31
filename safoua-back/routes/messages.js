const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversations,
  getMessages,
  markAsRead
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { messageValidation, validate } = require('../middleware/validation');

router.post('/', protect, messageValidation, validate, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessages);
router.put('/:messageId/read', protect, markAsRead);

module.exports = router;
