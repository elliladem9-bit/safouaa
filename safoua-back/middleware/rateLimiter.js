const rateLimit = require('express-rate-limit');

// General API rate limiter
exports.apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development' // Skip in development
});

// Strict limiter for auth routes
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 50 : 5, // More lenient in development
  message: 'Too many authentication attempts, please try again later',
  skipSuccessfulRequests: true,
  skip: (req) => process.env.NODE_ENV === 'development' && req.ip === '::1' // Skip localhost in dev
});

// Upload limiter
exports.uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 100 : 20,
  message: 'Too many upload requests, please try again later',
  skip: (req) => process.env.NODE_ENV === 'development'
});
