const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const feedRoutes = require('./routes/feedRoutes');
const expensRoutes = require('./routes/expenseRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/trips',tripRoutes);
app.use('/api/bookings',bookingRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/expenser', expensRoutes);
app.use('/api/admin', adminRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});


// Global Error Handler
app.use(errorHandler);

module.exports = app;