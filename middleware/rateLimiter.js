const rateLimit = require('express-rate-limit');

/**
 * General API Rate Limiter
 * Limits requests across all API routes to prevent denial-of-service.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});

/**
 * Strict Rate Limiter for Authentication Endpoints
 * Mitigates brute-force credential stuffing and password guessing.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 authentication attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login/registration attempts from this IP. Please try again in 15 minutes.',
  },
});

module.exports = { apiLimiter, authLimiter };
