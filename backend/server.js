const app = require('./app');
const connectMongo = require('./config/db.mongo');
const pool = require('./config/db.mysql');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test MySQL Connection
    const connection = await pool.getConnection();
    console.log('MySQL Connected successfully.');
    connection.release();

    // Connect MongoDB
    await connectMongo();

    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error.message);
    process.exit(1);
  }
};

startServer();