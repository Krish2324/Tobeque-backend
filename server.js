const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Central Logger in dev mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading static images across domains
}));
app.use(cors({
  origin: [
    'http://localhost:3000',  // frontend-admin
    'http://localhost:5173',  // frontend-website (vite default)
    'http://localhost:5174',  // frontend-website (alternate port)
    'http://localhost:4173',  // vite preview
  ],
  credentials: true
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folders exist
const uploadDirs = [
  'uploads',
  'uploads/products',
  'uploads/banners',
  'uploads/site',
  'uploads/misc'
];
uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Map Static Assets Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user-auth', require('./routes/userAuth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/products', require('./routes/product'));
app.use('/api/categories', require('./routes/category'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/customers', require('./routes/customer'));
app.use('/api/coupons', require('./routes/coupon'));
app.use('/api/banners', require('./routes/banner'));
app.use('/api/reviews', require('./routes/review'));
app.use('/api/reports', require('./routes/report'));
app.use('/api/settings', require('./routes/setting'));
app.use('/api/season-collection', require('./routes/seasonCollection'));

// Root Status check
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'Tobeque Admin API Service is up and running!',
    timestamp: new Date()
  });
});

// Global central error handler middleware
app.use(errorHandler);

// Safe migration: adds columns that exist in the model but not yet in the DB
const runSafeMigrations = async () => {
  const migrations = [
    // Orders table - add coupon_code if missing
    { table: 'orders', column: 'coupon_code', sql: `ALTER TABLE orders ADD COLUMN coupon_code VARCHAR(255) NULL` },
    // Categories table - add display_type if missing
    { table: 'categories', column: 'display_type', sql: `ALTER TABLE categories ADD COLUMN display_type VARCHAR(255) NULL DEFAULT 'Default'` },
    // Categories table - add google_product_category if missing
    { table: 'categories', column: 'google_product_category', sql: `ALTER TABLE categories ADD COLUMN google_product_category VARCHAR(255) NULL` },
  ];

  for (const m of migrations) {
    try {
      // Check if column already exists by querying table info
      const [results] = await sequelize.query(`PRAGMA table_info(${m.table})`);
      const exists = results.some(col => col.name === m.column);
      if (!exists) {
        await sequelize.query(m.sql);
        console.log(`Migration: Added column '${m.column}' to table '${m.table}'.`);
      }
    } catch (err) {
      // Column may already exist in non-SQLite DB — log and continue
      console.warn(`Migration skipped for '${m.table}.${m.column}':`, err.message);
    }
  }
};

// Connect DB & Start Server
const startServer = async () => {
  try {
    // 1. Authenticate connection
    await testConnection();

    // 2. Synchronize Sequelize Models
    console.log('Synchronizing database schemas...');
    // In development mode, we sync tables safely
    await sequelize.sync();
    console.log('Database schemas synced.');

    // 3. Run safe column migrations for new fields added after initial sync
    await runSafeMigrations();

    // 4. Bind port and start listening
    app.listen(PORT, () => {
      console.log(`===================================================`);
      console.log(`   SERVER IS RUNNING IN ${process.env.NODE_ENV.toUpperCase()} MODE`);
      console.log(`   API Listening at: http://localhost:${PORT}`);
      console.log(`===================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

