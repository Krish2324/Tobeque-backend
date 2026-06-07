const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'order_number'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    field: 'tax_amount'
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    field: 'shipping_cost'
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    field: 'discount_amount'
  },
  couponCode: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'coupon_code'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    field: 'total_amount'
  },
  orderStatus: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'),
    allowNull: false,
    defaultValue: 'pending',
    field: 'order_status'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'pending',
    field: 'payment_status'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'cod',
    field: 'payment_method' // e.g. "stripe", "paypal", "cod"
  },
  shippingStatus: {
    type: DataTypes.ENUM('pending', 'shipped', 'out_for_delivery', 'delivered'),
    allowNull: false,
    defaultValue: 'pending',
    field: 'shipping_status'
  },
  shippingMethod: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'shipping_method'
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'shipping_address'
  },
  billingAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'billing_address'
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'tracking_number'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Order;
