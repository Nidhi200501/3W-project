const mongoose = require('mongoose');

let isConnected = false;

// Disable Mongoose command buffering when disconnected so queries fail fast or fallback
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskplanet_social',
      { serverSelectionTimeoutMS: 3000 }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (error) {
    console.warn(`MongoDB Connection Error: ${error.message} -> Falling back to active in-memory database store.`);
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };

