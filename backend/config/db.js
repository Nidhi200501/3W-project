const mongoose = require('mongoose');

// Disable Mongoose command buffering when disconnected so queries fail fast with clear errors
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('CRITICAL: Neither MONGODB_URI nor MONGO_URI environment variable is configured!');
      return;
    }
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Failure: ${error.message}`);
  }
};

module.exports = { connectDB };
