const { Assessment, Submission } = require('../models/Assessment');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const cloudinary = require('../config/cloudinary');

// @desc    Get assessments by course
// @route   GET /api/assessments/course/:courseId
// @access  Private
exports.getAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ 
      course: req.params.courseId,
      isPublished: true 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assessments.length,
      data: assessments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assessment
// @route   GET /api/assessments/:id
// @access  Private
exports.getAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('course');

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Check if user is enrolled or is the instructor
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: assessment.course._id
    });

    const isInstructor = assessment.course.instructor.toString() === req.user._id.toString();

    if (!enrollment && !isInstructor && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not enrolled in this course' });
    }

    res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create assessment
// @route   POST /api/assessments
// @access  Private (Teacher/Admin)
exports.createAssessment = async (req, res, next) => {
  try {
    const course = await Course.findById(req.body.course);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Calculate total points
    if (req.body.questions) {
      req.body.totalPoints = req.body.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    }

    const assessment = await Assessment.create(req.body);

    res.status(201).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update assessment
// @route   PUT /api/assessments/:id
// @access  Private (Teacher/Admin)
exports.updateAssessment = async (req, res, next) => {
  try {
    let assessment = await Assessment.findById(req.params.id).populate('course');

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Check ownership
    if (assessment.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    assessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete assessment
// @route   DELETE /api/assessments/:id
// @access  Private (Teacher/Admin)
exports.deleteAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('course');

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Check ownership
    if (assessment.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await assessment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assessment
// @route   POST /api/assessments/:id/submit
// @access  Private
exports.submitAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      assessment: assessment._id,
      student: req.user._id
    });

    if (existingSubmission) {
      return res.status(400).json({ success: false, message: 'Already submitted' });
    }

    let fileUrl = '';
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'submissions', resource_type: 'raw' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      fileUrl = result.secure_url;
    }

    // Auto-grade if quiz
    let score = 0;
    if (assessment.type === 'quiz' && req.body.answers) {
      const answers = JSON.parse(req.body.answers);
      answers.forEach(answer => {
        const question = assessment.questions.id(answer.questionId);
        if (question && question.correctAnswer === answer.answer) {
          score += question.points;
        }
      });
    }

    const submission = await Submission.create({
      assessment: assessment._id,
      student: req.user._id,
      answers: req.body.answers ? JSON.parse(req.body.answers) : [],
      fileUrl,
      score,
      status: assessment.type === 'quiz' ? 'graded' : 'pending'
    });

    res.status(201).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grade submission
// @route   PUT /api/assessments/submission/:id/grade
// @access  Private (Teacher/Admin)
exports.gradeSubmission = async (req, res, next) => {
  try {
    const { score, feedback } = req.body;

    const submission = await Submission.findById(req.params.id).populate({
      path: 'assessment',
      populate: { path: 'course' }
    });

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    // Check ownership
    const course = submission.assessment.course;
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    submission.score = score;
    submission.feedback = feedback;
    submission.status = 'graded';
    submission.gradedAt = Date.now();
    submission.gradedBy = req.user._id;
    await submission.save();

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get submissions for assessment
// @route   GET /api/assessments/:id/submissions
// @access  Private (Teacher/Admin)
exports.getSubmissions = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('course');

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Check ownership
    if (assessment.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const submissions = await Submission.find({ assessment: assessment._id })
      .populate('student', 'name email')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};
