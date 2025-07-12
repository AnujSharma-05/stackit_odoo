import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({limit: '16kb'})); 
app.use(express.urlencoded({ extended: true, limit: '16kb' })); 
app.use(express.static('public')); 
app.use(cookieParser()); 

// Import routes
import authRoutes from './modules/auth/routes/auth.routes.js';
import userRoutes from "./modules/user/routes/user.routes.js";
import questionRoutes from './modules/qa/routes/question.routes.js';
import answerRoutes from './modules/qa/routes/answer.routes.js';
import voteRoutes from './modules/qa/routes/vote.routes.js';
import tagRoutes from './modules/qa/routes/tag.routes.js';
import notificationRoutes from './modules/qa/routes/notification.routes.js';
import migrationRoutes from './modules/admin/routes/migration.routes.js';
import statsRoutes from './modules/stats/routes/stats.routes.js';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin/migration', migrationRoutes);
app.use('/api/stats', statsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'StackIt API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;