const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    // 1. Role escalation safeguard - verified before hitting database
    let assignedRole = 'user';
    if (role === 'artist') {
      assignedRole = 'artist';
    } else if (role === 'admin') {
      const validAdminSecret = process.env.ADMIN_REGISTRATION_SECRET;
      const isAdminAuthorized =
        (validAdminSecret && adminSecret === validAdminSecret) ||
        (req.user && req.user.role === 'admin');

      if (!isAdminAuthorized) {
        const error = new Error(
          'Unauthorized: Admin role registration requires valid authorization credentials.'
        );
        error.statusCode = 403;
        return next(error);
      }
      assignedRole = 'admin';
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('A user with this email already exists.');
      error.statusCode = 409;
      return next(error);
    }

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      return next(error);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      return next(error);
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
