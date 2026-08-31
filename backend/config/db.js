const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskplanet_social'
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    isConnected = false;
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
