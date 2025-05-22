// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

// Set default environment variables if not loaded from .env
if (!process.env.PORT) process.env.PORT = 5000;
// For MongoDB Atlas, replace with: mongodb+srv://<username>:<password>@cluster0.mongodb.net/restaurant_db
if (!process.env.MONGODB_URI) process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/restaurant_db";
if (!process.env.NODE_ENV) process.env.NODE_ENV = "development";
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = "secretkey123456";

const app = require('./app');

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 