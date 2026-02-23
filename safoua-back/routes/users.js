const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  deleteAccount,
  uploadProfilePicture
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadProfilePicture: uploadProfilePictureMiddleware } = require('../middleware/upload');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/account', protect, deleteAccount);
router.post('/profile-picture', protect, uploadProfilePictureMiddleware, uploadProfilePicture);
router.post('/upload-profile-picture', protect, uploadProfilePictureMiddleware, uploadProfilePicture);

module.exports = router;
