const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/book_a_doctor';
    const conn = await mongoose.connect(uri);
    const isAtlas = uri.includes('mongodb.net') || uri.startsWith('mongodb+srv');
    const label = isAtlas ? 'MongoDB Atlas (Cloud)' : 'MongoDB Local';

    console.log(`[Database Connected] ${label} | Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Connection Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
