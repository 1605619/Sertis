const mongoose = require('mongoose');
require('dotenv').config();

let connection; // Singleton Pattern - to create DB connection

const connectDB = async () => {
  if (!connection) {
    try {
      connection = await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      process.exit(1);
    }
  }

  return connection;
};

module.exports = connectDB;
