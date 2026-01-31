const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${options.email}`);
  } catch (error) {
    logger.error(`Email error: ${error.message}`);
    throw new Error('Email could not be sent');
  }
};

const emailTemplates = {
  resetPassword: (token, name) => `
    <h1>Password Reset Request</h1>
    <p>Hello ${name},</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${process.env.FRONTEND_URL}/reset-password/${token}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `,
  
  teacherApproval: (name) => `
    <h1>Teacher Account Approved</h1>
    <p>Hello ${name},</p>
    <p>Congratulations! Your teacher account has been approved at Safoua Academy.</p>
    <p>You can now create and manage courses on our platform.</p>
  `,
  
  teacherPromotion: (name) => `
    <h1>Promoted to Teacher</h1>
    <p>Hello ${name},</p>
    <p>Congratulations! You have been promoted to teacher status at Safoua Academy.</p>
    <p>You now have access to create and manage courses on our platform.</p>
    <p>Visit your teacher dashboard to get started!</p>
  `,
  
  enrollmentRequest: (studentName, courseName, teacherName, message) => `
    <h1>New Course Enrollment Request</h1>
    <p>Hello ${teacherName},</p>
    <p>Student <strong>${studentName}</strong> has requested to enroll in your course <strong>${courseName}</strong>.</p>
    ${message ? `<p><strong>Student's message:</strong> ${message}</p>` : ''}
    <p>Please review and respond to this request in your teacher dashboard.</p>
    <p><a href="${process.env.FRONTEND_URL}/teacher-dashboard">View Request</a></p>
  `,
  
  enrollmentApproved: (studentName, courseName, teacherResponse) => `
    <h1>Course Enrollment Approved!</h1>
    <p>Hello ${studentName},</p>
    <p>Great news! Your enrollment request for <strong>${courseName}</strong> has been approved.</p>
    ${teacherResponse ? `<p><strong>Teacher's message:</strong> ${teacherResponse}</p>` : ''}
    <p>You can now access the course content in your dashboard.</p>
    <p><a href="${process.env.FRONTEND_URL}/student-dashboard">Start Learning</a></p>
  `,
  
  enrollmentRejected: (studentName, courseName, teacherResponse) => `
    <h1>Course Enrollment Request Update</h1>
    <p>Hello ${studentName},</p>
    <p>Your enrollment request for <strong>${courseName}</strong> has been reviewed.</p>
    <p><strong>Status:</strong> Not approved at this time</p>
    ${teacherResponse ? `<p><strong>Teacher's message:</strong> ${teacherResponse}</p>` : ''}
    <p>You can browse other available courses or try applying again later.</p>
    <p><a href="${process.env.FRONTEND_URL}/courses">Browse Courses</a></p>
  `,
  
  teacherApplicationReceived: (applicantName, applicantEmail, message, qualifications, experience) => `
    <h1>New Teacher Application</h1>
    <p>A new teacher application has been submitted:</p>
    <p><strong>Applicant:</strong> ${applicantName} (${applicantEmail})</p>
    ${message ? `<p><strong>Application Message:</strong> ${message}</p>` : ''}
    ${qualifications ? `<p><strong>Qualifications:</strong> ${qualifications}</p>` : ''}
    ${experience ? `<p><strong>Teaching Experience:</strong> ${experience}</p>` : ''}
    <p>Please review this application in the admin panel.</p>
    <p><a href="${process.env.FRONTEND_URL}/admin">Review Application</a></p>
  `,
  
  teacherApplicationApproved: (name, adminResponse) => `
    <h1>Teacher Application Approved!</h1>
    <p>Hello ${name},</p>
    <p>Congratulations! Your teacher application has been approved.</p>
    <p>You now have teacher privileges and can create courses on Safoua Academy.</p>
    ${adminResponse ? `<p><strong>Admin message:</strong> ${adminResponse}</p>` : ''}
    <p><a href="${process.env.FRONTEND_URL}/teacher-dashboard">Access Teacher Dashboard</a></p>
  `,
  
  teacherApplicationRejected: (name, adminResponse) => `
    <h1>Teacher Application Update</h1>
    <p>Hello ${name},</p>
    <p>Thank you for your interest in becoming a teacher at Safoua Academy.</p>
    <p>After careful review, we are unable to approve your application at this time.</p>
    ${adminResponse ? `<p><strong>Admin message:</strong> ${adminResponse}</p>` : ''}
    <p>You are welcome to reapply in the future as you gain more experience.</p>
  `
};

module.exports = { sendEmail, emailTemplates };
