const { User, Order, AdminLog } = require('../models');

// @desc    Get List of Customers
// @route   GET /api/customers
// @access  Private
const getCustomers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      sortBy = 'createdAt',
      sortDir = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      where.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ];
    }

    const count = await User.countDocuments(where);
    const rows = await User.find(where)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ [sortBy]: sortDir.toUpperCase() === 'DESC' ? -1 : 1 });

    res.json({
      success: true,
      data: {
        customers: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Customer Detail & History
// @route   GET /api/customers/:id
// @access  Private
const getCustomerById = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    // Fetch complete ordering history
    const orders = await Order.find({ user: customer.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      customer,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle block/unblock user
// @route   PUT /api/customers/:id/status
// @access  Private
const toggleCustomerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // status should be 'active' or 'blocked'

    const customer = await User.findById(id);

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    if (status && ['active', 'blocked'].includes(status)) {
      customer.status = status;
    } else {
      customer.status = customer.status === 'active' ? 'blocked' : 'active';
    }

    await customer.save();

    await AdminLog.create({
      adminId: req.admin.id,
      action: `Toggled customer ${customer.email} account state to ${customer.status}`,
      entityType: 'customer',
      entityId: customer.id,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: `Customer account has been ${customer.status === 'active' ? 'unblocked' : 'blocked'} successfully`,
      customer
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  toggleCustomerStatus
};
