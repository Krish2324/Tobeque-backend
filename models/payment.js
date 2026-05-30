const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'order_id'
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    field: 'transaction_id'
  },
  gateway: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'stripe'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('succeeded', 'failed', 'pending', 'refunded'),
    allowNull: false,
    defaultValue: 'pending'
  },
  gatewayResponse: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'gateway_response'
  }
});

module.exports = Payment;
