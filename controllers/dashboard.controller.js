const { Order, User, Product, OrderItem, AdminLog, sequelize } = require('../models');
const { Op } = require('sequelize');

// @desc    Get Central Admin Dashboard Stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Calculate General Widgets Metrics
    const totalOrdersCount = await Order.count();
    
    // Sum of paid or active orders for total sales
    const totalSalesSum = await Order.sum('totalAmount', {
      where: {
        paymentStatus: 'paid'
      }
    }) || 0.00;

    const totalCustomersCount = await User.count({
      where: { status: 'active' }
    });

    const totalProductsCount = await Product.count();

    // 2. Fetch Low Stock Alert Products (stock <= 10)
    const lowStockAlerts = await Product.findAll({
      where: {
        stockQuantity: {
          [Op.lte]: 10
        }
      },
      attributes: ['id', 'name', 'sku', 'stockQuantity', 'price', 'thumbnail'],
      limit: 10
    });

    // 3. Fetch Top Selling Products
    // We group by productId, summing quantity
    const topSellers = await OrderItem.findAll({
      attributes: [
        'productId',
        'productName',
        'sku',
        [sequelize.fn('SUM', sequelize.col('OrderItem.quantity')), 'totalSold'],
        [sequelize.fn('SUM', sequelize.literal('OrderItem.quantity * OrderItem.price')), 'totalRevenue']
      ],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['thumbnail']
        }
      ],
      group: ['OrderItem.product_id', 'OrderItem.product_name', 'OrderItem.sku', 'product.id'],
      order: [[sequelize.literal('totalSold'), 'DESC']],
      limit: 5
    });

    // 4. Fetch Latest 5 Orders
    const latestOrders = await Order.findAll({
      attributes: ['id', 'orderNumber', 'totalAmount', 'orderStatus', 'createdAt'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // 5. Monthly Sales Aggregation (Last 6 Months)
    // We query order collections, grouping by month/year
    // To ensure portability across SQLite and MySQL, we can extract details via manual dates grouping or raw dialect queries.
    // Let's implement an elegant manual distribution query or dynamic dialect formatter.
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start of month

    const ordersForChart = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: sixMonthsAgo
        },
        paymentStatus: 'paid'
      },
      attributes: ['totalAmount', 'createdAt'],
      order: [['createdAt', 'ASC']]
    });

    // Let's group and format month labels dynamically in JS so it works flawlessly on BOTH MySQL and SQLite dialects!
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartDataMap = {};

    // Initialize map for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${months[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
      chartDataMap[key] = { month: key, sales: 0, orders: 0 };
    }

    ordersForChart.forEach(order => {
      const date = new Date(order.createdAt);
      const key = `${months[date.getMonth()]} ${date.getFullYear().toString().substring(2)}`;
      if (chartDataMap[key]) {
        chartDataMap[key].sales += parseFloat(order.totalAmount);
        chartDataMap[key].orders += 1;
      }
    });

    const monthlySalesChart = Object.values(chartDataMap);

    // 6. Get Recent Admin Activity Logs
    const recentActivity = await AdminLog.findAll({
      attributes: ['id', 'action', 'entityType', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 8
    });

    res.json({
      success: true,
      data: {
        widgets: {
          totalSales: parseFloat(totalSalesSum.toFixed(2)),
          totalOrders: totalOrdersCount,
          totalCustomers: totalCustomersCount,
          totalProducts: totalProductsCount
        },
        lowStock: lowStockAlerts,
        topProducts: topSellers,
        latestOrders,
        monthlySalesChart,
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
