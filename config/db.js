const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://dixitdesai809_db_user:ZTxCAFxdmnCEmgzZ@tobeque.nsvhk6i.mongodb.net/tobeque_ecommerce?appName=Tobeque';

const testConnection = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Database Connection has been established successfully (MongoDB).');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = {
  mongoose,
  testConnection
};
