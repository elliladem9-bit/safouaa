const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { sendEmail, emailTemplates } = require('../utils/email');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = role ? { role } : {};

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('enrolledCourses')
      .populate('createdCourses');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Promote user to teacher
// @route   PUT /api/admin/users/:id/promote-teacher
// @access  Private (Admin)
exports.promoteToTeacher = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role !== 'student') {
      return res.status(400).json({ success: false, message: 'User is not a student' });
    }

    user.role = 'teacher';
    user.isTeacherApproved = true;
    user.teacherApplicationStatus = 'approved';
    await user.save();

    // Send promotion email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Promoted to Teacher',
        html: emailTemplates.teacherPromotion(user.name)
      });
    } catch (error) {
      // Log but don't fail
    }

    res.status(200).json({
      success: true,
      message: 'User promoted to teacher successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply for teacher role
// @route   POST /api/admin/apply-teacher
// @access  Private (Student)
exports.applyForTeacher = async (req, res, next) => {
  try {
    const { message, qualifications, teachingExperience } = req.body;

    if (req.user.role !== 'student') {
      return res.status(400).json({ success: false, message: 'Only students can apply for teacher role' });
    }

    if (req.user.teacherApplicationStatus === 'pending') {
      return res.status(400).json({ success: false, message: 'Teacher application already pending' });
    }

    if (req.user.teacherApplicationStatus === 'approved') {
      return res.status(400).json({ success: false, message: 'Already approved as teacher' });
    }

    // Update user with application details
    req.user.teacherApplicationStatus = 'pending';
    req.user.teacherApplicationMessage = message || '';
    req.user.qualifications = qualifications || '';
    req.user.teachingExperience = teachingExperience || '';
    await req.user.save();

    // Get all admins for notification
    const admins = await User.find({ role: 'admin' }).select('email');

    // Send notification emails to admins
    for (const admin of admins) {
      try {
        await sendEmail({
          email: admin.email,
          subject: 'New Teacher Application',
          html: `
            <h2>New Teacher Application</h2>
            <p><strong>Applicant:</strong> ${req.user.name} (${req.user.email})</p>
            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
            ${qualifications ? `<p><strong>Qualifications:</strong> ${qualifications}</p>` : ''}
            ${teachingExperience ? `<p><strong>Teaching Experience:</strong> ${teachingExperience}</p>` : ''}
            <p>Please review this application in the admin panel.</p>
          `
        });
      } catch (error) {
        console.error('Failed to send admin notification:', error);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Teacher application submitted successfully',
      data: {
        status: req.user.teacherApplicationStatus,
        message: req.user.teacherApplicationMessage
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher applications
// @route   GET /api/admin/teacher-applications
// @access  Private (Admin)
exports.getTeacherApplications = async (req, res, next) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;

    const query = {
      teacherApplicationStatus: status,
      role: 'student'
    };

    const applications = await User.find(query)
      .select('name email teacherApplicationMessage qualifications teachingExperience teacherApplicationStatus createdAt')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to teacher application
// @route   PUT /api/admin/teacher-applications/:id/respond
// @access  Private (Admin)
exports.respondToTeacherApplication = async (req, res, next) => {
  try {
    const { status, adminResponse } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.teacherApplicationStatus !== 'pending') {
      return res.status(400).json({ success: false, message: 'Application already processed' });
    }

    // Update application status
    user.teacherApplicationStatus = status;

    if (status === 'approved') {
      user.role = 'teacher';
      user.isTeacherApproved = true;
    }

    await user.save();

    // Send notification email
    try {
      const emailSubject = status === 'approved' 
        ? 'Teacher Application Approved' 
        : 'Teacher Application Update';
      
      const emailContent = status === 'approved'
        ? `
          <h2>Congratulations!</h2>
          <p>Your teacher application has been approved. You now have teacher privileges and can create courses.</p>
          ${adminResponse ? `<p><strong>Admin message:</strong> ${adminResponse}</p>` : ''}
        `
        : `
          <h2>Teacher Application Update</h2>
          <p>Your teacher application has been reviewed.</p>
          <p><strong>Status:</strong> ${status}</p>
          ${adminResponse ? `<p><strong>Admin message:</strong> ${adminResponse}</p>` : ''}
        `;

      await sendEmail({
        email: user.email,
        subject: emailSubject,
        html: emailContent
      });
    } catch (error) {
      console.error('Failed to send notification email:', error);
    }

    res.status(200).json({
      success: true,
      message: `Teacher application ${status} successfully`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve teacher
// @route   PUT /api/admin/teachers/:id/approve
// @access  Private (Admin)
exports.approveTeacher = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role !== 'teacher') {
      return res.status(400).json({ success: false, message: 'User is not a teacher' });
    }

    user.isTeacherApproved = true;
    await user.save();

    // Send approval email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Teacher Account Approved',
        html: emailTemplates.teacherApproval(user.name)
      });
    } catch (error) {
      // Log but don't fail
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending teachers
// @route   GET /api/admin/teachers/pending
// @access  Private (Admin)
exports.getPendingTeachers = async (req, res, next) => {
  try {
    const teachers = await User.find({
      role: 'teacher',
      isTeacherApproved: false
    }).select('-password');

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher', isTeacherApproved: true });
    const pendingTeachers = await User.countDocuments({ role: 'teacher', isTeacherApproved: false });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const totalEnrollments = await Enrollment.countDocuments();

    // Get recent enrollments
    const recentEnrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get popular courses
    const popularCourses = await Course.find({ isPublished: true })
      .sort({ students: -1 })
      .limit(5)
      .select('title students rating');

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalStudents,
          totalTeachers,
          pendingTeachers,
          totalCourses,
          publishedCourses,
          totalEnrollments
        },
        recentEnrollments,
        popularCourses
      }
    });
  } catch (error) {
    next(error);
  }
};
