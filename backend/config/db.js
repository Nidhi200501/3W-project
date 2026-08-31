const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    // 2.5s connection timeout so server falls back gracefully to in-memory mode if local MongoDB is not running
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskplanet_social',
      {
        serverSelectionTimeoutMS: 2500
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (error) {
    console.warn(`MongoDB Not Connected (${error.message}). Running in Self-Contained In-Memory Mode.`);
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
