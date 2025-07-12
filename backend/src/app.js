import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors());

app.use(express.json({limit: '16kb'})); // Limit request body size to 16kb (allowing json requests)
app.use(express.urlencoded({ extended: true, limit: '16kb' })); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(cookieParser()); // Parse cookies from request headers

// import routes
import authRoutes from './modules/auth/routes/auth.routes.js';
import userRoutes from "./modules/user/routes/user.routes.js";

// use routes
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);


export default app;