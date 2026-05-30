const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  barcode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shortDescription: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'short_description'
  },
  fullDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'full_description'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  discountPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'discount_price'
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
    field: 'tax_rate'
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'stock_quantity'
  },
  weight: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  dimensions: {
    type: DataTypes.STRING,
    allowNull: true // format: "10x20x15 cm"
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    allowNull: false,
    defaultValue: 'draft'
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_featured'
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  variants: {
    type: DataTypes.JSON,
    allowNull: true // structure: [{ size: 'M', color: 'Black', stock: 10, price: 99.00, sku: 'TSH-M-BLK' }]
  },
  seoTitle: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'seo_title'
  },
  seoDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'seo_description'
  },
  countdownEvergreen: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    field: 'countdown_evergreen'
  },
  restartCountdownAfter: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'restart_countdown_after'
  },
  countdownTimerProfile: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'countdown_timer_profile'
  },
  enableProgressBar: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    field: 'enable_progress_bar'
  },
  whenAchievingGoal: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'when_achieving_goal'
  },
  goal: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  initialQuantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'initial_quantity'
  },
  taxStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'tax_status'
  },
  taxClass: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'tax_class'
  },
  hsnSacCode: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'hsn_sac_code'
  },
  whatsAppNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'whatsapp_number'
  },
  callToAction: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'call_to_action'
  },
  preFilledMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'pre_filled_message'
  },
  displaySettings: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'display_settings'
  }
});

module.exports = Product;
