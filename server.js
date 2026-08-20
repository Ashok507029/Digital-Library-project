require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const connectDB = require('./config/db');

const path = require('path');

// Import routes
const bookRoutes        = require('./routes/books');
const memberRoutes      = require('./routes/members');
const transactionRoutes = require('./routes/transactions');
const analyticsRoutes   = require('./routes/analytics');
const paymentRoutes     = require('./routes/payment');
const authRoutes        = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware — allow file:// and localhost origins
app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

// Request logging (development)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/books',        bookRoutes);
app.use('/api/members',      memberRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics',    analyticsRoutes);
app.use('/api/payment',      paymentRoutes);
app.use('/api/auth',         authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Alexandria Digital Library API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Alexandria Digital Library API Server`);
  console.log(`   Running on: http://localhost:${PORT}`);
  console.log(`   Health:     http://localhost:${PORT}/api/health`);
  console.log(`   Books API:  http://localhost:${PORT}/api/books\n`);
});
