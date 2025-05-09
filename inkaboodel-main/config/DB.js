const mongoose = require('mongoose');
require('dotenv').config()
const dbURI =process.env.MONGO_URL

const connectDB = () => {
    mongoose.connect(dbURI)
      .then(() => console.log('🍃🍃Connected to MongoDB🍃🍃'))
      .catch((error) => console.error('Connection error', error));
  };
  
  module.exports = connectDB;