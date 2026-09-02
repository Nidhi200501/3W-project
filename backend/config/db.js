const mongoose = require('mongoose');

// Enable command buffering for short connection grace period
mongoose.set('bufferCommands', true);

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskplanet_social';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`MongoDB Connection Warning: ${error.message}. Running in high-reliability In-Memory mode.`);
  }
};

const isDbConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

module.exports = { connectDB, isDbConnected };

