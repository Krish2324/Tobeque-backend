const { sequelize } = require('../config/db');
const Admin = require('./admin');
const User = require('./user');
const Category = require('./category');
const Brand = require('./brand');
const Product = require('./product');
const ProductImage = require('./productImage');
const Coupon = require('./coupon');
const Order = require('./order');
const OrderItem = require('./orderItem');
const Payment = require('./payment');
const Review = require('./review');
const Banner = require('./banner');
const InventoryLog = require('./inventoryLog');
const AdminLog = require('./adminLog');
const Setting = require('./setting');
const SeasonCollection = require('./seasonCollection');

// === Category Associations (Nested/Self-referential) ===
Category.hasMany(Category, { as: 'subcategories', foreignKey: 'parentId', onDelete: 'CASCADE' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' });

// === Product Associations ===
Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Brand.hasMany(Product, { foreignKey: 'brandId', onDelete: 'SET NULL' });
Product.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });

Product.hasMany(ProductImage, { as: 'images', foreignKey: 'productId', onDelete: 'CASCADE' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

// === Order Associations ===
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(OrderItem, { as: 'items', foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId', onDelete: 'SET NULL' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// === Payment Associations ===
Order.hasMany(Payment, { as: 'payments', foreignKey: 'orderId', onDelete: 'CASCADE' });
Payment.belongsTo(Order, { foreignKey: 'orderId' });

// === Review Associations ===
Product.hasMany(Review, { as: 'reviews', foreignKey: 'productId', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// === Inventory Log Associations ===
Product.hasMany(InventoryLog, { as: 'inventoryLogs', foreignKey: 'productId', onDelete: 'CASCADE' });
InventoryLog.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Admin.hasMany(InventoryLog, { foreignKey: 'adminId', onDelete: 'SET NULL' });
InventoryLog.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });

// === Admin Log Associations ===
Admin.hasMany(AdminLog, { foreignKey: 'adminId', onDelete: 'CASCADE' });
AdminLog.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });

// === Season Collection Associations ===
Product.hasMany(SeasonCollection, { as: 'seasonCollectionItems', foreignKey: 'productId', onDelete: 'CASCADE' });
SeasonCollection.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
  sequelize,
  Admin,
  User,
  Category,
  Brand,
  Product,
  ProductImage,
  Coupon,
  Order,
  OrderItem,
  Payment,
  Review,
  Banner,
  InventoryLog,
  AdminLog,
  Setting,
  SeasonCollection
};
