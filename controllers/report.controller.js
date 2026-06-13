const { Order, OrderItem, User, Product } = require('../models');

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
        $gte: new Date(startDate + ' 00:00:00'),
        $lte: new Date(endDate + ' 23:59:59')
      };
    } else if (startDate) {
      where.createdAt = {
        $gte: new Date(startDate + ' 00:00:00')
      };
    } else if (endDate) {
      where.createdAt = {
        $lte: new Date(endDate + ' 23:59:59')
      };
    }

    // Query aggregates
    const orders = await Order.find(where)
      .sort({ createdAt: -1 })
      .populate('user', 'id firstName lastName email');

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

    // Fetch product sales breakdown using Mongoose Lookup aggregation
    const orderMatch = {
      'order.paymentStatus': 'paid'
    };
    if (startDate || endDate) {
      orderMatch['order.createdAt'] = {};
      if (startDate) {
        orderMatch['order.createdAt'].$gte = new Date(startDate + ' 00:00:00');
      }
      if (endDate) {
        orderMatch['order.createdAt'].$lte = new Date(endDate + ' 23:59:59');
      }
    }

    const rawProductSales = await OrderItem.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: 'order',
          foreignField: '_id',
          as: 'order'
        }
      },
      { $unwind: '$order' },
      { $match: orderMatch },
      {
        $group: {
          _id: '$product',
          productName: { $first: '$productName' },
          sku: { $first: '$sku' },
          quantitySold: { $sum: '$quantity' },
          revenueGenerated: { $sum: { $multiply: ['$quantity', '$price'] } }
        }
      },
      { $sort: { quantitySold: -1 } }
    ]);

    const productSales = rawProductSales.map(item => ({
      productId: item._id,
      productName: item.productName,
      sku: item.sku,
      quantitySold: item.quantitySold,
      revenueGenerated: parseFloat(item.revenueGenerated.toFixed(2))
    }));

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
