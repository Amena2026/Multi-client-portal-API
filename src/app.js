const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Client Portal API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes (uncomment as you create them)
app.use('/api/clients', require('./routes/clients'));
app.use('/api/projects', require('./routes/projects'));
// app.use('/api/tasks', require('./routes/tasks'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (should be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

module.exports = app;