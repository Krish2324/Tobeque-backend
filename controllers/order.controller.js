const { Order, OrderItem, User, Product, Payment, InventoryLog, AdminLog } = require('../models');
const { Op } = require('sequelize');

// @desc    Get List of Orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      paymentStatus,
      sortBy = 'createdAt',
      sortDir = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const where = {};

    if (status) {
      where.orderStatus = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (search) {
      where[Op.or] = [
        { orderNumber: { [Op.like]: `%${search}%` } },
        { trackingNumber: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortDir.toUpperCase()]],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      distinct: true
    });

    res.json({
      success: true,
      data: {
        orders: rows,
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

// @desc    Get Order Detail By ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['thumbnail'] }] },
        { model: Payment, as: 'payments' }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    let orderData = order.toJSON();
    try {
      if (typeof orderData.shippingAddress === 'string') {
        orderData.shippingAddress = JSON.parse(orderData.shippingAddress);
      }
      if (typeof orderData.billingAddress === 'string') {
        orderData.billingAddress = JSON.parse(orderData.billingAddress);
      }
    } catch(e) {}

    res.json({
      success: true,
      order: orderData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Order Status & Inventory Restock Logic
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, shippingStatus, trackingNumber, notes } = req.body;
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const oldOrderStatus = order.orderStatus;
    const newOrderStatus = orderStatus || oldOrderStatus;

    // Determine if inventory needs restocking (if status switches to cancelled or returned from an active status)
    const isNowCancelledOrReturned = ['cancelled', 'returned'].includes(newOrderStatus);
    const wasActiveStatus = !['cancelled', 'returned'].includes(oldOrderStatus);

    if (isNowCancelledOrReturned && wasActiveStatus) {
      console.log(`Order ${order.orderNumber} status changed from ${oldOrderStatus} to ${newOrderStatus}. Restocking items...`);
      for (const item of order.items) {
        if (item.productId) {
          const product = await Product.findByPk(item.productId);
          if (product) {
            const priorQty = product.stockQuantity;
            product.stockQuantity += item.quantity;
            await product.save();

            // Log stock restock action
            await InventoryLog.create({
              productId: product.id,
              stockChanged: item.quantity,
              actionType: newOrderStatus === 'cancelled' ? 'correction' : 'return',
              reference: `Restock due to Order #${order.orderNumber} ${newOrderStatus}`,
              adminId: req.admin.id
            });
          }
        }
      }
    }

    // Determine if inventory needs deducting (if status switches BACK from cancelled/returned to active)
    const isNowActive = !['cancelled', 'returned'].includes(newOrderStatus);
    const wasCancelledOrReturned = ['cancelled', 'returned'].includes(oldOrderStatus);

    if (isNowActive && wasCancelledOrReturned) {
      console.log(`Order ${order.orderNumber} status reactivated from ${oldOrderStatus} to ${newOrderStatus}. Deducting items...`);
      for (const item of order.items) {
        if (item.productId) {
          const product = await Product.findByPk(item.productId);
          if (product) {
            product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
            await product.save();

            await InventoryLog.create({
              productId: product.id,
              stockChanged: -item.quantity,
              actionType: 'sale',
              reference: `Deduct due to Order #${order.orderNumber} reactivation`,
              adminId: req.admin.id
            });
          }
        }
      }
    }

    // Update order details
    order.orderStatus = newOrderStatus;
    order.paymentStatus = paymentStatus || order.paymentStatus;
    order.shippingStatus = shippingStatus || order.shippingStatus;
    order.trackingNumber = trackingNumber !== undefined ? trackingNumber : order.trackingNumber;
    order.notes = notes !== undefined ? notes : order.notes;

    // Automatically synchronize shipping status depending on order status
    if (order.orderStatus === 'delivered') {
      order.shippingStatus = 'delivered';
      order.paymentStatus = 'paid'; // COD orders marked as delivered are paid
    } else if (order.orderStatus === 'shipped') {
      order.shippingStatus = 'shipped';
    }

    await order.save();

    await AdminLog.create({
      adminId: req.admin.id,
      action: `Updated order status for #${order.orderNumber} to ${order.orderStatus}`,
      entityType: 'order',
      entityId: order.id,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch Printable Invoice Details
// @route   GET /api/orders/:id/invoice
// @access  Private
const getInvoiceDetails = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['firstName', 'lastName', 'email', 'phone'] },
        { model: OrderItem, as: 'items' }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({
      success: true,
      invoice: {
        orderNumber: order.orderNumber,
        date: order.createdAt,
        billingAddress: order.billingAddress,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        subtotal: order.subtotal,
        taxAmount: order.taxAmount,
        shippingCost: order.shippingCost,
        discountAmount: order.discountAmount,
        totalAmount: order.totalAmount,
        customer: order.user,
        items: order.items
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  getInvoiceDetails
};
