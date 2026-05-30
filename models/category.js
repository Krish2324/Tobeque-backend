const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Category = sequelize.define('Category', {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  banner: {
    type: DataTypes.STRING,
    allowNull: true
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'parent_id'
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
  displayType: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Default',
    field: 'display_type'
  },
  googleProductCategory: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'google_product_category'
  }
});

module.exports = Category;
