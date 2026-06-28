const jwt = require('jsonwebtoken');
const { User, Order, OrderItem, Product, Coupon } = require('../models');

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
    let user = await User.findOne({ phone: normalizedPhone });

    if (!user) {
      user = await User.create({
        phone: normalizedPhone,
        firstName: 'Guest',
        lastName: 'User',
        email: `${normalizedPhone}@guest.local`,
        password: DEV_OTP,
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

    const user = await User.findOne({ phone: normalizedPhone });

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
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate a coupon code
// @route   POST /api/user-auth/validate-coupon
// @access  Public
const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, error: 'Coupon code is required' });
    }

    const codeUpper = code.toString().toUpperCase().trim();
    const coupon = await Coupon.findOne({ code: codeUpper });

    if (!coupon) {
      return res.status(404).json({ success: false, error: 'Invalid coupon code' });
    }

    if (!coupon.status) {
      return res.status(400).json({ success: false, error: 'This coupon is no longer active' });
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return res.status(400).json({ success: false, error: 'This coupon is not active yet' });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
      return res.status(400).json({ success: false, error: 'This coupon has expired' });
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, error: 'This coupon has reached its usage limit' });
    }

    if (cartTotal && parseFloat(cartTotal) < parseFloat(coupon.minOrderAmount)) {
      return res.status(400).json({ success: false, error: `Minimum order amount of ₹${coupon.minOrderAmount} required` });
    }

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount
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
    const user = await User.findById(req.user.id).select('-password -otpCode -otpExpiry');

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
    const orders = await Order.find({ user: req.user.id })
      .sort('-createdAt')
      .populate({
        path: 'items',
        populate: {
          path: 'product',
          select: 'name thumbnail'
        }
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
    const user = await User.findById(req.user.id);

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
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Place a new order
// @route   POST /api/user-auth/orders
// @access  Private (user)
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, items, customerName, customerPhone, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in order' });
    }

    // Generate unique order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${randomStr}`;

    let subtotal = 0;

    // Process items and check stock
    const processedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, error: `Product not found for ID ${item.productId}` });
      }
      
      const price = parseFloat(item.price);
      subtotal += price * item.quantity;
      
      processedItems.push({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        price: price,
        quantity: item.quantity,
        variantDetails: item.variantDetails || null
      });
    }

    let discountAmount = 0;
    let appliedCouponCode = null;

    if (couponCode) {
      const codeUpper = couponCode.toString().toUpperCase().trim();
      const coupon = await Coupon.findOne({ code: codeUpper, status: true });
      
      if (coupon) {
        const now = new Date();
        const isStarted = !coupon.startDate || new Date(coupon.startDate) <= now;
        const isNotExpired = !coupon.expiryDate || new Date(coupon.expiryDate) >= now;
        const hasUsageLeft = coupon.usageCount < coupon.usageLimit;
        const meetsMinOrder = subtotal >= parseFloat(coupon.minOrderAmount);

        if (isStarted && isNotExpired && hasUsageLeft && meetsMinOrder) {
          appliedCouponCode = coupon.code;
          if (coupon.type === 'percentage') {
            discountAmount = (subtotal * parseFloat(coupon.discountValue)) / 100;
          } else {
            discountAmount = parseFloat(coupon.discountValue);
          }
          // Cap discount at subtotal
          if (discountAmount > subtotal) discountAmount = subtotal;
          
          // Increment usage count
          coupon.usageCount += 1;
          await coupon.save();
        }
      }
    }

    // Tax & Shipping logic can be added later if needed. Defaults to 0 here.
    const totalAmount = subtotal - discountAmount;

    // Format address object to match Admin OrderDetail.jsx expectation
    const finalAddress = typeof shippingAddress === 'object' ? shippingAddress : {
      name: customerName || `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Customer',
      phone: customerPhone || req.user.phone || '',
      street: shippingAddress || req.user.address || 'N/A',
      city: req.user.city || '',
      state: req.user.state || '',
      zip: req.user.zipCode || '',
      country: 'India'
    };

    const addressString = JSON.stringify(finalAddress);

    // Create the order
    const order = await Order.create({
      user: req.user.id,
      orderNumber,
      subtotal,
      totalAmount,
      orderStatus: 'pending',
      paymentStatus: 'paid', // Dummy success
      paymentMethod: 'card',
      shippingStatus: 'pending',
      shippingAddress: addressString,
      billingAddress: addressString,
      discountAmount,
      couponCode: appliedCouponCode
    });

    // Create order items and deduct inventory
    for (const pItem of processedItems) {
      await OrderItem.create({
        order: order._id,
        product: pItem.productId,
        productName: pItem.productName,
        sku: pItem.sku,
        price: pItem.price,
        quantity: pItem.quantity,
        variantDetails: pItem.variantDetails
      });

      // Deduct inventory
      const productToUpdate = await Product.findById(pItem.productId);
      if (productToUpdate) {
        productToUpdate.stockQuantity = Math.max(0, productToUpdate.stockQuantity - pItem.quantity);
        await productToUpdate.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload user profile photo
// @route   POST /api/user-auth/profile/photo
// @access  Private (user)
const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const photoUrl = req.file.path;
    user.profilePhoto = photoUrl;
    await user.save();

    res.json({
      success: true,
      message: 'Profile photo updated successfully',
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
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  validateCoupon,
  getUserProfile,
  getUserOrders,
  updateUserProfile,
  createOrder,
  uploadProfilePhoto
};
