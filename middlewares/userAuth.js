const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Protect route for regular users (not admins)
const protectUser = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecretjwtsecretkeyshouldbecomplex39284'
      );

      // Ensure it's a user token (not admin)
      if (decoded.type !== 'user') {
        return res.status(401).json({
          success: false,
          error: 'Not authorized — invalid token type'
        });
      }

      req.user = await User.findById(decoded.id).select('-password -otpCode -otpExpiry');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized, user not found'
        });
      }

      if (req.user.status === 'blocked') {
        return res.status(403).json({
          success: false,
          error: 'Your account has been blocked'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token failed or expired'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token provided'
    });
  }
};

module.exports = { protectUser };
