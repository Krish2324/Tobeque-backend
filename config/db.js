const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

if (process.env.DB_NAME && process.env.DB_USER) {
  // Configured for MySQL
  console.log('Database Config: Connecting to MySQL database...');
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false, // Set to console.log in debug mode if needed
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true // converts camelCase model names to snake_case table names
      }
    }
  );
} else {
  // SQLite Fallback for zero-config quick local development and testing
  console.log('Database Config: MySQL details not provided. Falling back to local SQLite database...');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  });
}

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  testConnection
};
