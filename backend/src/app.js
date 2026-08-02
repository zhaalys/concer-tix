const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const config = require('./config');

const app = express();

// CORS: menerima beberapa origin (dipisah koma) + request tanpa origin (webhook/curl)
const allowedOrigins = (config.clientUrl || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Base Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Concer TIX API Service',
    version: '1.0.0',
    documentation: '/api/v1/health'
  });
});

// API Routes
app.use('/api/v1', apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
