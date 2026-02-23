const User = require('../models/User');
const { saveFile } = require('../config/localStorage');
const logger = require('../utils/logger');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses', 'title thumbnail')
      .populate('createdCourses', 'title thumbnail');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, bio, profilePicture, qualifications, teachingExperience } = req.body;

    const updateData = { name, bio };
    
    // Only update email if it's different
    if (email && email !== req.user.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      updateData.email = email;
    }

    // Add profile picture if provided
    if (profilePicture) {
      updateData.profilePicture = profilePicture;
    }

    // Add teacher-specific fields if user is a teacher
    if (req.user.role === 'teacher') {
      if (qualifications !== undefined) updateData.qualifications = qualifications;
      if (teachingExperience !== undefined) updateData.teachingExperience = teachingExperience;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/upload-profile-picture
// @access  Private
exports.uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    // Save file locally
    const result = await saveFile(req.file, 'profile-pictures');

    res.status(200).json({
      success: true,
      data: { url: result.secure_url }
    });
  } catch (error) {
    next(error);
  }
};
