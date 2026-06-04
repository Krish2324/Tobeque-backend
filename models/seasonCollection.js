const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SeasonCollection = sequelize.define('SeasonCollection', {
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
  displayLabel: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'display_label'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sort_order'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'video_url'
  }
}, {
  tableName: 'season_collections',
  timestamps: true
});

module.exports = SeasonCollection;
