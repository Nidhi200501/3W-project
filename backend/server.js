const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();

// Body parser - 10mb limit for base64 image strings
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Robust CORS configuration supporting process.env.CLIENT_URL, Vercel production domain, and wildcard fallback
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://3-w-project-eta.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback to allow request
    }
  },
  credentials: true
};
app.use(cors(corsOptions));

// Connect Database with fallback check
connectDB();

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// Root / Healthcheck
app.get('/', (req, res) => {
  res.json({
    message: 'TaskPlanet Mini Social Post API is running 🚀',
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/signup', 'POST /api/auth/login', 'GET /api/auth/me'],
      posts: ['GET /api/posts?page=1&limit=5', 'POST /api/posts', 'POST /api/posts/:id/like', 'POST /api/posts/:id/comment']
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
