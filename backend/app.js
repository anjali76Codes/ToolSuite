import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Importing Routes and Handlers
import ApiUserRoutes from './routes/apiuser.route.js';
import UserRoutes from './routes/user.route.js';
import networkRoutes from './routes/network.routes.js';
// import paymentRoutes from './routes/paymentRoutes.js';
import postRoutes from './routes/post.routes.js';
import paymentStoreRoutes from './routes/paymentStore.route.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS setup to allow your frontend origin
const corsOptions = {
  origin: 'https://tool-suite-8a2qeva9j-anjali76codes-projects.vercel.app', // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // List allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // List allowed headers
  credentials: true, // Allow cookies and other credentials
};

// Middleware
app.use(cors(corsOptions));  // Applying CORS middleware with the configured options
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api', ApiUserRoutes);
app.use('/api/auth', UserRoutes);
app.use('/api/network', networkRoutes);
// app.use('/api/payment', paymentRoutes);
app.use('/api/community', postRoutes);
app.use('/api/payment', paymentStoreRoutes);

// Root route (for testing)
app.get('/', (req, res) => {
  res.send('Hello, World from env port!');
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
