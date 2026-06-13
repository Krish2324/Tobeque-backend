const { Order, User, Product, OrderItem, AdminLog } = require('../models');

// @desc    Get Central Admin Dashboard Stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Calculate General Widgets Metrics
    const totalOrdersCount = await Order.countDocuments();
    
    // Sum of paid or active orders for total sales
    const paidOrdersSum = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalSalesSum = paidOrdersSum.length > 0 ? paidOrdersSum[0].total : 0.00;

    const totalCustomersCount = await User.countDocuments({ status: 'active' });

    const totalProductsCount = await Product.countDocuments();

    // 2. Fetch Low Stock Alert Products (stock <= 10)
    const lowStockAlerts = await Product.find({ stockQuantity: { $lte: 10 } })
      .select('id name sku stockQuantity price thumbnail')
      .limit(10);

    // 3. Fetch Top Selling Products
    // We group by product (ref productId), summing quantity
    const topSellersAgg = await OrderItem.aggregate([
      {
        $group: {
          _id: '$product',
          productName: { $first: '$productName' },
          sku: { $first: '$sku' },
          totalSold: { $sum: '$quantity' },
          totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // Populate the product details
    const topSellers = await Promise.all(topSellersAgg.map(async (item) => {
      let productDetails = null;
      if (item._id) {
        productDetails = await Product.findById(item._id).select('thumbnail');
      }
      return {
        productId: item._id,
        productName: item.productName,
        sku: item.sku,
        totalSold: item.totalSold,
        totalRevenue: parseFloat(item.totalRevenue.toFixed(2)),
        product: productDetails ? { thumbnail: productDetails.thumbnail } : null
      };
    }));

    // 4. Fetch Latest 5 Orders
    const latestOrdersDocs = await Order.find()
      .select('id orderNumber totalAmount orderStatus createdAt user')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(5);

    const latestOrders = latestOrdersDocs.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
      user: order.user
    }));

    // 5. Monthly Sales Aggregation (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start of month
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const ordersForChart = await Order.find({
      createdAt: {
        $gte: sixMonthsAgo
      },
      paymentStatus: 'paid'
    }).select('totalAmount createdAt').sort({ createdAt: 1 });

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

    const monthlySalesChart = Object.values(chartDataMap).map(c => ({
      ...c,
      sales: parseFloat(c.sales.toFixed(2))
    }));

    // 6. Get Recent Admin Activity Logs
    const recentActivity = await AdminLog.find()
      .select('id action entityType createdAt')
      .sort({ createdAt: -1 })
      .limit(8);

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
