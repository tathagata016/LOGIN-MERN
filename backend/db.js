// Import mongoose
const mongoose = require('mongoose');

// Define the MongoDB connection URL (for localhost)
const dbURL = 'mongodb://127.0.0.1:27017/login';

// Connect to MongoDB
mongoose.connect(dbURL)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Optionally, you can handle connection events
const db =mongoose.connection
db.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

db.on('error', (err) => {
  console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

module.exports = db;