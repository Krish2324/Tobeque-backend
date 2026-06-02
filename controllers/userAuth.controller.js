const jwt = require('jsonwebtoken');
const { User, Order, OrderItem, Product } = require('../models');

// Development permanent OTP — change to real OTP generation in production
const DEV_OTP = '123456';
const OTP_EXPIRY_MINUTES = 30;

const generateUserToken = (id) => {
  return jwt.sign(
    { id, type: 'user' },
    process.env.JWT_SECRET || 'supersecretjwtsecretkeyshouldbecomplex39284',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @desc    Send OTP to mobile number
// @route   POST /api/user-auth/send-otp
// @access  Public
const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    // Normalize phone: remove spaces/dashes, ensure no leading zeros issue
    const normalizedPhone = String(phone).replace(/\s+/g, '').replace(/-/g, '');

    // Find or create user by phone
    let user = await User.findOne({ where: { phone: normalizedPhone } });

    if (!user) {
      user = await User.create({
        phone: normalizedPhone,
        status: 'active'
      });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, error: 'This account has been blocked. Please contact support.' });
    }

    // Set OTP and expiry
    const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    user.otpCode = DEV_OTP;
    user.otpExpiry = expiry;
    await user.save();

    // In production, send SMS here. For dev, OTP is hardcoded to 123456.
    res.json({
      success: true,
      message: `OTP sent to ${normalizedPhone}. (Dev mode: use 123456)`,
      // In production, NEVER return the OTP in the response
      devNote: 'Development mode — OTP is always 123456'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and log in user
// @route   POST /api/user-auth/verify-otp
// @access  Public
const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, error: 'Phone number and OTP are required' });
    }

    const normalizedPhone = String(phone).replace(/\s+/g, '').replace(/-/g, '');

    const user = await User.findOne({ where: { phone: normalizedPhone } });

    if (!user) {
      return res.status(404).json({ success: false, error: 'No account found for this phone number. Please request an OTP first.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, error: 'This account has been blocked.' });
    }

    // Validate OTP
    if (!user.otpCode || user.otpCode !== String(otp)) {
      return res.status(401).json({ success: false, error: 'Invalid OTP. Please try again.' });
    }

    // Check expiry
    if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
      return res.status(401).json({ success: false, error: 'OTP has expired. Please request a new one.' });
    }

    // Clear OTP after successful use
    user.otpCode = null;
    user.otpExpiry = null;
    await user.save();

    const token = generateUserToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        status: user.status,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        gender: user.gender,
        sizePreference: user.sizePreference
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's profile
// @route   GET /api/user-auth/profile
// @access  Private (user)
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'otpCode', 'otpExpiry'] }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's order history
// @route   GET /api/user-auth/orders
// @access  Private (user)
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['name', 'thumbnail']
            }
          ]
        }
      ]
    });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details (name, email, address, sizes)
// @route   PUT /api/user-auth/profile
// @access  Private (user)
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (req.body.firstName !== undefined) user.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) user.lastName = req.body.lastName;
    if (req.body.email !== undefined) user.email = req.body.email;
    if (req.body.address !== undefined) user.address = req.body.address;
    if (req.body.city !== undefined) user.city = req.body.city;
    if (req.body.state !== undefined) user.state = req.body.state;
    if (req.body.zipCode !== undefined) user.zipCode = req.body.zipCode;
    if (req.body.gender !== undefined) user.gender = req.body.gender;
    if (req.body.sizePreference !== undefined) user.sizePreference = req.body.sizePreference;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        status: user.status,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        gender: user.gender,
        sizePreference: user.sizePreference
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  getUserProfile,
  getUserOrders,
  updateUserProfile
};
