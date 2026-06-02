const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'last_name'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('active', 'blocked'),
    allowNull: false,
    defaultValue: 'active'
  },
  // OTP fields for mobile login
  otpCode: {
    type: DataTypes.STRING(6),
    allowNull: true,
    field: 'otp_code'
  },
  otpExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'otp_expiry'
  },
  // Additional fields for fashion profile
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'zip_code'
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sizePreference: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'size_preference'
  }
});

module.exports = User;
