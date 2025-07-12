# StackIt Q&A Platform 🚀

A comprehensive Q&A platform built with the MERN stack, similar to Stack Overflow. This application provides a complete question-and-answer system with user authentication, voting, rich text editing, and admin controls.

## 🌟 Features

### For All Users (Guest Access)
- ✅ Browse and search questions
- ✅ View question details and answers
- ✅ Filter questions by tags
- ✅ Responsive design for all devices

### For Registered Users
- ✅ User registration and authentication
- ✅ Create and edit questions with rich text editor
- ✅ Submit answers with formatting options
- ✅ **Reddit-like Question Detail Pages** - Expandable question view with threaded answers
- ✅ **Advanced Voting System** - Upvote/downvote questions and answers with real-time score updates
- ✅ **Answer Acceptance** - Question authors can mark best answers as accepted
- ✅ **View Tracking** - Automatic view count increments for question popularity
- ✅ **Rich Answer Interface** - Enhanced answer composition with tips and formatting
- ✅ Comment on answers
- ✅ Receive real-time notifications
- ✅ Manage personal profile and reputation
- ✅ Tag questions for better categorization

### For Administrators
- ✅ All user features plus admin controls
- ✅ Delete any question or answer
- ✅ Manage user accounts and permissions
- ✅ Admin dashboard with analytics
- ✅ Content moderation tools

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **TipTap** - Rich text editor
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Headless UI** - Accessible UI components
- **date-fns** - Date utilities

## 📁 Project Structure

```
stackit-platform/
├── stackit-backend/          # Node.js/Express API
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   └── server.js            # Main server file
├── stackit-frontend/         # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── App.js           # Main app component
│   └── public/              # Static assets
└── docs/                    # Documentation
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shl0kpatel/round1odoo.git
   cd round1odoo
   ```

2. **Install Backend Dependencies**
   ```bash
   cd stackit-backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../stackit-frontend
   npm install
   ```

4. **Set up Environment Variables**
   
   Create `.env` file in `stackit-backend/`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/stackit
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

5. **Start MongoDB**
   ```bash
   # If installed as service
   net start MongoDB
   
   # Or manually
   mongod
   ```

6. **Run the Application**
   
   **Backend (Terminal 1):**
   ```bash
   cd stackit-backend
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd stackit-frontend
   npm start
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Questions Endpoints
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create question
- `GET /api/questions/:id` - Get question by ID
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `POST /api/questions/:id/vote` - Vote on question

### Answers Endpoints
- `POST /api/answers` - Create answer
- `PUT /api/answers/:id` - Update answer
- `DELETE /api/answers/:id` - Delete answer
- `POST /api/answers/:id/vote` - Vote on answer
- `POST /api/answers/:id/comments` - Add comment

### Tags Endpoints
- `GET /api/tags` - Get all tags
- `GET /api/tags/popular` - Get popular tags

## 🎯 Key Features Explained

### Rich Text Editor
- Powered by TipTap editor
- Supports bold, italic, code blocks, lists
- Markdown-like syntax
- Real-time preview

### Reddit-like Question Detail Interface
- **Expandable Question View** - Click any question to open detailed view
- **Threaded Answer System** - Answers displayed in Reddit-style format
- **Real-time Vote Counts** - Live upvote/downvote with immediate feedback
- **Answer Acceptance** - Green checkmark for accepted answers
- **View Tracking** - Automatic view count increment (excluding question author)
- **Enhanced UI** - Beautiful gradient backgrounds with smooth animations

### Voting System
- Upvote/downvote questions and answers
- Reputation system based on votes
- Prevents self-voting
- **Real-time vote score updates**
- **Visual feedback with color-coded scores**

### Tag System
- Categorize questions with tags
- Filter questions by tags
- Popular tags display

### Notification System
- Real-time notifications for user actions
- Notification history
- Mark as read functionality

### Search & Filter
- Full-text search across questions
- Filter by tags, date, votes
- Sort by newest, oldest, most voted

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Rate limiting ready

## 🎨 UI/UX Features

- Responsive design for all screen sizes
- Modern, clean interface
- Loading states and error handling
- Toast notifications
- Accessible components

## 🧪 Testing

```bash
# Backend tests
cd stackit-backend
npm test

# Frontend tests
cd stackit-frontend
npm test
```

## 🙏 Acknowledgments

- Inspired by Stack Overflow
- Built with modern web technologies
- Community-driven development

## 🐛 Bug Reports & Feature Requests

Please use the [GitHub Issues](https://github.com/Shl0kpatel/round1odoo/issues) for bug reports and feature requests.

