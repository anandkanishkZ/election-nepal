const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Import database configuration
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Allow multiple frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:4173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import routes
const gisRoutes = require('./routes/gisRoutes');
const voterRoutes = require('./routes/voterRoutes');
const hierarchyRoutes = require('./routes/hierarchyRoutes');
const comparativeRoutes = require('./routes/comparativeRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// API Routes
app.use('/api', gisRoutes);
app.use('/api', voterRoutes);
app.use('/api/hierarchy', hierarchyRoutes);
app.use('/api', comparativeRoutes);
app.use('/api', analyticsRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbConnected = await db.testConnection();
    res.json({
      status: 'healthy',
      message: 'Nepal Election Analysis API is running',
      timestamp: new Date().toISOString(),
      database: {
        connected: dbConnected,
        name: process.env.DB_NAME || 'voter_db',
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Nepal Election Analysis API',
    version: '1.0.0',
    database: process.env.DB_NAME || 'voter_db',
    endpoints: {
      health: '/health',
      // GIS Endpoints
      nepalUnits: '/api/nepal-units',
      unitById: '/api/nepal-units/:id',
      statistics: '/api/statistics',
      search: '/api/search',
      // Voter Endpoints
      voters: '/api/voters',
      voterById: '/api/voters/:id',
      searchVoters: '/api/voters/search/query',
      votersByLocation: '/api/voters/location/filter',
      voterStatistics: '/api/voter-statistics',
      electionResults: '/api/election-results',
      // Database Endpoints
      databaseInfo: '/api/database/info',
      tableSchema: '/api/database/schema/:tableName',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: 'Endpoint not found',
    path: req.path,
  });
});

// Start server
app.listen(PORT, async () => {
  console.log('='.repeat(60));
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🗄️  Database: ${process.env.DB_NAME || 'voter_db'}`);
  console.log('='.repeat(60));
  
  // Test database connection
  console.log('Testing database connection...');
  const dbConnected = await db.testConnection();
  if (dbConnected) {
    console.log('✓ Database connection successful!');
  } else {
    console.log('⚠️  Warning: Database connection failed. Some features may not work.');
  }
  console.log('='.repeat(60));
});

module.exports = app;
