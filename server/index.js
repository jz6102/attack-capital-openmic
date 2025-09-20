require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');
const precallRoutes = require('./routes/precall');
const functionRoutes = require('./routes/function');
const postcallRoutes = require('./routes/postcall');
const botController = require('./controllers/botController');
const callLogController = require('./controllers/callLogController');

const PORT = process.env.PORT || 8080;
const app = express();

// Basic middlewares
app.use(helmet());
// CORS: allow the deployed client and localhost for development.
// Note: the origin value must include the scheme (https://) to match the browser's Origin header.
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'https://attack-capital-openmic-client-bbq6qz727-jaikanna-bs-projects.vercel.app',
  'http://localhost:5173', // common Vite dev port
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Debug: show incoming Origin header so we can verify what the browser is sending
    // (This will appear in Render logs). Example: https://your-app.vercel.app
    if (origin) console.debug('Incoming request Origin:', origin);

    // allow requests with no origin (server-to-server, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // Do NOT throw an Error here. Returning `callback(null, false)` will simply
    // prevent CORS headers from being set. The browser will block the request
    // client-side, but the server won't log a stack trace for normal cross-origin
    // attempts (reduces noisy logs). We still log a warning to help debugging.
    console.warn('CORS: origin not allowed:', origin);
    return callback(null, false);
  }
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Connect DB
connectDB();

// Health
app.get('/', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV || 'dev' }));

// Webhook endpoints (exposed for OpenMic)
app.post('/precall', precallRoutes);
app.post('/function', functionRoutes);
app.post('/postcall', postcallRoutes);

// API routes for Bots
app.get('/api/bots', botController.getAllBots);
app.post('/api/bots', botController.createBot);
app.delete('/api/bots/:id', botController.deleteBot);

// API routes for Call Logs
app.get('/api/call-logs', callLogController.getAllCallLogs);
app.get('/api/call-logs/:id', callLogController.getCallLogById);

// Generic error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'internal_server_error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
