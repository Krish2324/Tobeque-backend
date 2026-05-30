const { Order, OrderItem, User, Product, sequelize } = require('../models');
const { Op } = require('sequelize');

// @desc    Generate Sales and Financial Reports
// @route   GET /api/reports/sales
// @access  Private
const getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {
      paymentStatus: 'paid' // only account settled purchases in sales reports
    };

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate + ' 00:00:00'), new Date(endDate + ' 23:59:59')]
      };
    } else if (startDate) {
      where.createdAt = {
        [Op.gte]: new Date(startDate + ' 00:00:00')
      };
    } else if (endDate) {
      where.createdAt = {
        [Op.lte]: new Date(endDate + ' 23:59:59')
      };
    }

    // Query aggregates
    const orders = await Order.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    let totalRevenue = 0;
    let totalTax = 0;
    let totalShipping = 0;
    let totalDiscounts = 0;
    let totalSubtotal = 0;

    orders.forEach(o => {
      totalRevenue += parseFloat(o.totalAmount);
      totalTax += parseFloat(o.taxAmount);
      totalShipping += parseFloat(o.shippingCost);
      totalDiscounts += parseFloat(o.discountAmount);
      totalSubtotal += parseFloat(o.subtotal);
    });

    const averageOrderValue = orders.length > 0 ? (totalRevenue / orders.length) : 0.00;

    // Fetch product sales breakdown
    const productSales = await OrderItem.findAll({
      attributes: [
        'productId',
        'productName',
        'sku',
        [sequelize.fn('SUM', sequelize.col('OrderItem.quantity')), 'quantitySold'],
        [sequelize.fn('SUM', sequelize.literal('OrderItem.quantity * OrderItem.price')), 'revenueGenerated']
      ],
      include: [
        {
          model: Order,
          attributes: [],
          where
        }
      ],
      group: ['OrderItem.product_id', 'OrderItem.product_name', 'OrderItem.sku'],
      order: [[sequelize.literal('quantitySold'), 'DESC']]
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalOrders: orders.length,
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
          totalSubtotal: parseFloat(totalSubtotal.toFixed(2)),
          totalTax: parseFloat(totalTax.toFixed(2)),
          totalShipping: parseFloat(totalShipping.toFixed(2)),
          totalDiscounts: parseFloat(totalDiscounts.toFixed(2)),
          averageOrderValue: parseFloat(averageOrderValue.toFixed(2))
        },
        orders,
        productSales
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSalesReport
};
