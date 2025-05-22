const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // You can replace this with a MongoDB Atlas connection string
    // Example: mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/restaurant_db";
    
    console.log('Connecting to MongoDB with URI:', mongoURI);
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up connection error handlers
    mongoose.connection.on('error', err => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected, trying to reconnect...');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit the process, just log the error and continue
    // The API will work but return appropriate error responses for DB operations
  }
};

module.exports = connectDB; 