const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify JWT token
const protect = async (req, res, next) => {
  let token;

  try {
    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // No token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and remove password field
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
    });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admins only.',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = { protect, adminOnly };