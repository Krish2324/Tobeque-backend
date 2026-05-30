const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

// Protect route (check JWT)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtsecretkeyshouldbecomplex39284');

      // Get admin from token, exclude password
      req.admin = await Admin.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.admin) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized, admin user not found'
        });
      }

      if (!req.admin.status) {
        return res.status(403).json({
          success: false,
          error: 'Your account has been deactivated'
        });
      }

      next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token failed or expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token provided'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        error: `Role '${req.admin ? req.admin.role : 'anonymous'}' is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
