const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const InventoryLog = sequelize.define('InventoryLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id'
  },
  stockChanged: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'stock_changed' // positive for additions, negative for deductions
  },
  actionType: {
    type: DataTypes.ENUM('restock', 'sale', 'correction', 'return'),
    allowNull: false,
    defaultValue: 'correction',
    field: 'action_type'
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true // e.g. "Order #1029", "Admin Adjustment"
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'admin_id'
  }
}, {
  tableName: 'inventory_logs'
});

module.exports = InventoryLog;
