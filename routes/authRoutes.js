const express = require('express');
const { register, login } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const validateRequest = require('../middleware/validateRequest');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply auth rate limiting to mitigate brute-force attacks
router.post('/register', authLimiter, registerValidator, validateRequest, register);
router.post('/login', authLimiter, loginValidator, validateRequest, login);

module.exports = router;
