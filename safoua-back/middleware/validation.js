const { body, param, query, validationResult } = require('express-validator');

// Validation result handler
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// User validation rules
exports.registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email').isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student', 'teacher']).withMessage('Invalid role')
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

// Course validation rules
exports.courseValidation = [
  body('title').trim().notEmpty().withMessage('Course title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('category').isIn(['Quran', 'Arabic', 'Islamic Sciences', 'Hadith', 'Fiqh', 'Tafsir', 'Other'])
    .withMessage('Invalid category'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid level')
];

// Lesson validation rules
exports.lessonValidation = [
  body('title').trim().notEmpty().withMessage('Lesson title is required'),
  body('content').trim().notEmpty().withMessage('Lesson content is required'),
  body('order').isInt({ min: 1 }).withMessage('Order must be a positive integer'),
  body('duration').optional().isInt({ min: 0 }).withMessage('Duration must be a positive number')
];

// Assessment validation rules
exports.assessmentValidation = [
  body('title').trim().notEmpty().withMessage('Assessment title is required'),
  body('type').isIn(['quiz', 'assignment', 'exam']).withMessage('Invalid assessment type'),
  body('questions').optional().isArray().withMessage('Questions must be an array')
];

// Message validation rules
exports.messageValidation = [
  body('recipient').isMongoId().withMessage('Invalid recipient ID'),
  body('content').trim().notEmpty().withMessage('Message content is required')
    .isLength({ max: 5000 }).withMessage('Message cannot exceed 5000 characters')
];

// ID parameter validation
exports.idValidation = [
  param('id').isMongoId().withMessage('Invalid ID format')
];
