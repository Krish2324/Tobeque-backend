const { Admin, AdminLog } = require('../models');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'supersecretjwtsecretkeyshouldbecomplex39284',
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};

// @desc    Admin Login
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (!admin.status) {
      return res.status(403).json({ success: false, error: 'Your account is deactivated' });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Write login log
    await AdminLog.create({
      adminId: admin.id,
      action: 'Admin logged into system',
      entityType: 'auth',
      ipAddress: req.ip
    });

    res.json({
      success: true,
      token: generateToken(admin.id),
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    res.json({
      success: true,
      admin: req.admin
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Admin Profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;

    if (req.body.password) {
      admin.password = req.body.password;
    }

    await admin.save();

    await AdminLog.create({
      adminId: admin.id,
      action: 'Updated own profile details',
      entityType: 'auth',
      ipAddress: req.ip
    });

    res.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Admins
// @route   GET /api/auth/admins
// @access  Private (Superadmin only)
const getAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: 1 });

    res.json({
      success: true,
      admins
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create New Admin
// @route   POST /api/auth/admins
// @access  Private (Superadmin only)
const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, error: 'Admin with this email already exists' });
    }

    const newAdmin = await Admin.create({
      name,
      email,
      password,
      role: role || 'editor'
    });

    await AdminLog.create({
      adminId: req.admin.id,
      action: `Created new admin: ${email} (${role})`,
      entityType: 'admin',
      entityId: newAdmin.id,
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Admin Status (Toggle Active/Inactive)
// @route   PUT /api/auth/admins/:id/status
// @access  Private (Superadmin only)
const toggleAdminStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (id === req.admin.id.toString()) {
      return res.status(400).json({ success: false, error: 'You cannot deactivate your own account' });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin account not found' });
    }

    admin.status = status !== undefined ? status : !admin.status;
    await admin.save();

    await AdminLog.create({
      adminId: req.admin.id,
      action: `Toggled status of admin ${admin.email} to ${admin.status}`,
      entityType: 'admin',
      entityId: admin.id,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: `Admin account has been ${admin.status ? 'activated' : 'deactivated'}`,
      admin
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getProfile,
  updateProfile,
  getAdmins,
  createAdmin,
  toggleAdminStatus
};
