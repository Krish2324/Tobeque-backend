const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AdminLog = sequelize.define('AdminLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'admin_id'
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false // e.g. "Created Product: Super Widget"
  },
  entityType: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'entity_type' // e.g. "product", "order", "coupon"
  },
  entityId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'entity_id'
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'ip_address'
  }
}, {
  tableName: 'admin_logs'
});

module.exports = AdminLog;
