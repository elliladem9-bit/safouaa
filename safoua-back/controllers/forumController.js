const ForumPost = require('../models/Forum');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get forum posts for a course
// @route   GET /api/forum/course/:courseId
// @access  Private
exports.getForumPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const posts = await ForumPost.find({ course: req.params.courseId })
      .populate('author', 'name profilePicture role')
      .populate('comments.user', 'name profilePicture')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ isPinned: -1, createdAt: -1 });

    const count = await ForumPost.countDocuments({ course: req.params.courseId });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single forum post
// @route   GET /api/forum/:id
// @access  Private
exports.getForumPost = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name profilePicture role')
      .populate('comments.user', 'name profilePicture');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create forum post
// @route   POST /api/forum
// @access  Private
exports.createForumPost = async (req, res, next) => {
  try {
    const { course, title, content } = req.body;

    // Check if user is enrolled or is the instructor
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course
    });

    const courseDoc = await Course.findById(course);
    const isInstructor = courseDoc.instructor.toString() === req.user._id.toString();

    if (!enrollment && !isInstructor && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not enrolled in this course' });
    }

    const post = await ForumPost.create({
      course,
      author: req.user._id,
      title,
      content
    });

    await post.populate('author', 'name profilePicture role');

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update forum post
// @route   PUT /api/forum/:id
// @access  Private
exports.updateForumPost = async (req, res, next) => {
  try {
    let post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    post = await ForumPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete forum post
// @route   DELETE /api/forum/:id
// @access  Private
exports.deleteForumPost = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/forum/:id/comment
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.isLocked) {
      return res.status(403).json({ success: false, message: 'Post is locked' });
    }

    post.comments.push({
      user: req.user._id,
      content: req.body.content
    });

    await post.save();
    await post.populate('comments.user', 'name profilePicture');

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pin/Unpin post
// @route   PUT /api/forum/:id/pin
// @access  Private (Teacher/Admin)
exports.togglePin = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id).populate('course');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check if user is instructor or admin
    const isInstructor = post.course.instructor.toString() === req.user._id.toString();
    if (!isInstructor && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    post.isPinned = !post.isPinned;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lock/Unlock post
// @route   PUT /api/forum/:id/lock
// @access  Private (Teacher/Admin)
exports.toggleLock = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id).populate('course');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check if user is instructor or admin
    const isInstructor = post.course.instructor.toString() === req.user._id.toString();
    if (!isInstructor && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    post.isLocked = !post.isLocked;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};
