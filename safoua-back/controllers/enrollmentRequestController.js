const EnrollmentRequest = require('../models/EnrollmentRequest');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../utils/email');

// @desc    Create enrollment request
// @route   POST /api/enrollment-requests
// @access  Private (Student)
exports.createEnrollmentRequest = async (req, res, next) => {
  try {
    const { courseId, message } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId).populate('instructor');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // Check if request already exists
    const existingRequest = await EnrollmentRequest.findOne({
      student: req.user._id,
      course: courseId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'Enrollment request already pending' });
    }

    // Create enrollment request
    const enrollmentRequest = await EnrollmentRequest.create({
      student: req.user._id,
      course: courseId,
      message: message || ''
    });

    // Populate the request for response
    await enrollmentRequest.populate([
      { path: 'student', select: 'name email' },
      { path: 'course', select: 'title' }
    ]);

    // Send notification email to teacher
    try {
      await sendEmail({
        email: course.instructor.email,
        subject: 'New Course Enrollment Request',
        html: `
          <h2>New Enrollment Request</h2>
          <p>Student <strong>${req.user.name}</strong> has requested to enroll in your course <strong>${course.title}</strong>.</p>
          ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
          <p>Please review and respond to this request in your teacher dashboard.</p>
        `
      });
    } catch (error) {
      // Log but don't fail the request
      console.error('Failed to send notification email:', error);
    }

    res.status(201).json({
      success: true,
      message: 'Enrollment request submitted successfully',
      data: enrollmentRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enrollment requests for teacher's courses
// @route   GET /api/enrollment-requests/teacher
// @access  Private (Teacher)
exports.getTeacherEnrollmentRequests = async (req, res, next) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;

    // Get teacher's courses
    const teacherCourses = await Course.find({ instructor: req.user._id }).select('_id');
    const courseIds = teacherCourses.map(course => course._id);

    const query = {
      course: { $in: courseIds },
      ...(status !== 'all' && { status })
    };

    const requests = await EnrollmentRequest.find(query)
      .populate('student', 'name email profilePicture')
      .populate('course', 'title thumbnail')
      .sort({ requestedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await EnrollmentRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's enrollment requests
// @route   GET /api/enrollment-requests/student
// @access  Private (Student)
exports.getStudentEnrollmentRequests = async (req, res, next) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = req.query;

    const query = {
      student: req.user._id,
      ...(status !== 'all' && { status })
    };

    const requests = await EnrollmentRequest.find(query)
      .populate('course', 'title thumbnail instructor')
      .populate('course.instructor', 'name')
      .sort({ requestedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await EnrollmentRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to enrollment request
// @route   PUT /api/enrollment-requests/:id/respond
// @access  Private (Teacher)
exports.respondToEnrollmentRequest = async (req, res, next) => {
  try {
    const { status, teacherResponse } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const request = await EnrollmentRequest.findById(req.params.id)
      .populate('student', 'name email')
      .populate('course', 'title instructor');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Enrollment request not found' });
    }

    // Check if teacher owns the course
    if (request.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Request already processed' });
    }

    // Update request
    request.status = status;
    request.teacherResponse = teacherResponse || '';
    request.respondedAt = new Date();
    request.respondedBy = req.user._id;
    await request.save();

    // If approved, create enrollment
    if (status === 'approved') {
      await Enrollment.create({
        student: request.student._id,
        course: request.course._id,
        enrollmentMethod: 'approved_request'
      });

      // Add student to course
      await Course.findByIdAndUpdate(request.course._id, {
        $addToSet: { students: request.student._id }
      });

      // Add course to user's enrolled courses
      await User.findByIdAndUpdate(request.student._id, {
        $addToSet: { enrolledCourses: request.course._id }
      });
    }

    // Send notification email to student
    try {
      const emailSubject = status === 'approved' 
        ? 'Course Enrollment Approved' 
        : 'Course Enrollment Request Update';
      
      const emailContent = status === 'approved'
        ? `
          <h2>Enrollment Approved!</h2>
          <p>Great news! Your enrollment request for <strong>${request.course.title}</strong> has been approved.</p>
          ${teacherResponse ? `<p><strong>Teacher's message:</strong> ${teacherResponse}</p>` : ''}
          <p>You can now access the course content in your dashboard.</p>
        `
        : `
          <h2>Enrollment Request Update</h2>
          <p>Your enrollment request for <strong>${request.course.title}</strong> has been reviewed.</p>
          <p><strong>Status:</strong> ${status}</p>
          ${teacherResponse ? `<p><strong>Teacher's message:</strong> ${teacherResponse}</p>` : ''}
        `;

      await sendEmail({
        email: request.student.email,
        subject: emailSubject,
        html: emailContent
      });
    } catch (error) {
      console.error('Failed to send notification email:', error);
    }

    res.status(200).json({
      success: true,
      message: `Enrollment request ${status} successfully`,
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel enrollment request
// @route   DELETE /api/enrollment-requests/:id
// @access  Private (Student)
exports.cancelEnrollmentRequest = async (req, res, next) => {
  try {
    const request = await EnrollmentRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Enrollment request not found' });
    }

    // Check if student owns the request
    if (request.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Can only cancel pending requests' });
    }

    await EnrollmentRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Enrollment request cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};