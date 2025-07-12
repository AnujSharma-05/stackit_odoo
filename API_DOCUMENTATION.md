# StackIt API Documentation

## Base URL
- Development: `http://localhost:8000/api`
- Production: `https://your-backend-domain.com/api`

## Authentication
Most endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Health Check
- **GET** `/health` - Check if API is running

### Authentication (`/auth`)
- **POST** `/auth/register` - Register new user
- **POST** `/auth/login` - Login user
- **POST** `/auth/refresh-token` - Refresh JWT token
- **POST** `/auth/forgot-password` - Request password reset
- **POST** `/auth/reset-password` - Reset password with token
- **POST** `/auth/change-password` - Change password (authenticated)

### Users (`/users`)
- **GET** `/users/me` - Get current user profile (authenticated)
- **PUT** `/users/me` - Update current user profile (authenticated)
- **GET** `/users/profile/:username` - Get public user profile
- **GET** `/users/leaderboard` - Get user leaderboard
- **DELETE** `/users/me` - Deactivate account (authenticated)

### Questions (`/questions`)
- **GET** `/questions` - Get all questions (with optional filters)
- **GET** `/questions/:id` - Get specific question
- **POST** `/questions` - Create new question (authenticated)
- **PUT** `/questions/:id` - Update question (authenticated, owner only)
- **DELETE** `/questions/:id` - Delete question (authenticated, owner only)

### Answers (`/answers`)
- **GET** `/answers/question/:questionId` - Get answers for a question
- **POST** `/answers` - Create new answer (authenticated)
- **PUT** `/answers/:id` - Update answer (authenticated, owner only)
- **DELETE** `/answers/:id` - Delete answer (authenticated, owner only)
- **POST** `/answers/:id/accept` - Accept answer as solution (authenticated, question owner only)

### Votes (`/votes`)
- **POST** `/votes` - Vote on question/answer (authenticated)
  - Body: `{ targetId, targetType: 'Question'|'Answer', voteType: 'upvote'|'downvote' }`
- **DELETE** `/votes/:targetId/:targetType` - Remove vote (authenticated)

### Tags (`/tags`)
- **GET** `/tags` - Get all tags (with optional filters)
- **GET** `/tags/:id` - Get specific tag

### Notifications (`/notifications`)
- **GET** `/notifications` - Get user notifications (authenticated)
- **GET** `/notifications/unread-count` - Get unread notification count (authenticated)
- **PUT** `/notifications/:id/read` - Mark notification as read (authenticated)
- **PUT** `/notifications/mark-all-read` - Mark all notifications as read (authenticated)
- **DELETE** `/notifications/:id` - Delete notification (authenticated)

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "data": {...},
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": [...] // validation errors if any
}
```

## Common Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Sorting
- `sort` - Sort field (e.g., 'createdAt', 'title', 'votes')
- `order` - Sort order ('asc' or 'desc')

### Filtering
- `search` - Search term
- `tags` - Filter by tags (comma-separated)
- `status` - Filter by status
- `category` - Filter by category

## Environment Variables Required

### Backend (.env)
```
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/stackit_db
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000/api
```

## Getting Started

1. **Backend Setup:**
   ```powershell
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

2. **Frontend Setup:**
   ```powershell
   cd frontend
   npm install
   npm start
   ```

3. **Database Setup:**
   - Install MongoDB locally or use MongoDB Atlas
   - Update MONGODB_URI in backend/.env
   - Database and collections will be created automatically

## Notes

- The backend runs on port 8000 by default
- The frontend runs on port 3000 by default
- All timestamps are in ISO 8601 format
- File uploads are handled via Cloudinary
- Passwords are hashed using bcrypt
- JWT tokens expire after 24 hours (configurable)
- Refresh tokens expire after 7 days (configurable)
