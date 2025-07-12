# Problem Statement
## StackIt – A Minimal Q&A Forum Platform

A comprehensive Q&A platform built with the MERN stack, similar to Stack Overflow. This application provides a complete question-and-answer system with user authentication, voting, rich text editing, and admin controls.

## Team Members
Harshal Sharma
harshal2005.js@gmail.com
Anuj Sharma
anuj04222@gmail.com
Shlok Patel
shlokpatel.xc@gmail.com
Rajat Agarwal
agarwalrajat357@gmail.com



# 🧠 StackIt – Full Stack Q&A Platform

A feature-rich **Q&A web platform** (inspired by Stack Overflow) built with the **MERN stack (MongoDB, Express, React, Node.js)**.

This project supports:
- ✅ Rich text Q&A posting
- ✅ Tagging, voting, bookmarking
- ✅ Real-time notifications
- ✅ Admin moderation
- ✅ Secure authentication
- ✅ Responsive UI

---

## 🧭 Table of Contents

1. [Backend Architecture](#-backend-architecture)
2. [Frontend Features](#-frontend-features)
3. [API Reference](#-api-reference)
4. [Key Features](#-key-features)
5. [Security Considerations](#-security-considerations)
6. [Performance Optimizations](#-performance-optimizations)
7. [Setup Instructions](#-setup-instructions)

---

## 🧱 Backend Architecture

> Built using **Express**, **MongoDB**, **Mongoose**, and **Socket.io**



### 🗄️ Mongoose Models

- **User**: Auth, reputation, role (admin/user), avatar
- **Question**: Title, description, tags, views, votes
- **Answer**: Content, votes, isAccepted flag
- **Vote**: Separate vote tracking by type and target
- **Tag**: Question grouping with colors
- **Notification**: Real-time alerts
- **Indexes**: Compound and text indexes for performance

---

## 💻 Frontend Features

> Built using **React**, **React Router**, **Axios**, **TailwindCSS**, **Toastify**, and **Framer Motion**

### 🎨 Project Structure

<details>
<summary>Click to expand</summary>

```
frontend/
├── node_modules/ 
├── public/
│   └── index.html 
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── AdminRoute.jsx 
│   │   │   └── ProtectedRoute.jsx 
│   │   ├── Editor/
│   │   │   └── RichTextEditor.jsx 
│   │   ├── Layout/
│   │   │   └── Navbar.jsx 
│   │   ├── Notifications/
│   │   │   └── NotificationDropdown.jsx 
│   │   ├── Questions/
│   │   │   ├── AnswerComponent.jsx 
│   │   │   ├── AnswerForm.jsx
│   │   │   └── QuestionCard.jsx 
│   │   ├── Tags/
│   │   │   └── TagFilter.jsx
│   │   └── UI/
│   │       ├── LoadingSpinner.jsx 
│   │       ├── Pagination.jsx
│   │       └── VoteButtons.jsx 
│   ├── contexts/
│   │   └── AuthContext.jsx (
│   ├── pages/
│   │   ├── AdminDashboard.jsx)
│   │   ├── AskQuestionPage.jsx 
│   │   ├── HomePage.jsx 
│   │   ├── LoginPage.jsx
│   │   ├── NotificationsPage.jsx
│   │   ├── ProfilePage.jsx 
│   │   ├── QuestionDetailPage.jsx 
│   │   └── RegisterPage.jsx 
│   ├── services/
│   │   └── api.js 
│   ├── utility/
│   ├── App.jsx 
│   ├── index.css
│   └── index.js 
├── package-lock.json 
├── package.json 
├── postcss.config.js 
└── tailwind.config.js 
```
</details>

### 🧠 Major Frontend Functionalities

| Feature | Description |
|--------|-------------|
| **Auth** | Register, Login, Forgot/Reset Password with JWT |
| **Ask Question** | Rich text editor with tags and image support |
| **Answer Flow** | Post/edit/delete answers, vote, accept |
| **Vote System** | Upvote/downvote questions and answers |
| **Search & Filter** | Search by keyword or tags |
| **User Profiles** | View public profile, own contributions, leaderboard |
| **Admin Panel** | Moderate questions/answers, ban users |
| **Responsive Design** | Mobile-friendly using TailwindCSS |
| **Error Handling** | Toastify-based alerts, empty states, and loaders |
| **Pagination** | For questions and answers lists |

---

## 📡 API Reference

> Base URL: `/api/`

🔐 **Auth**: `/auth`  
👤 **Users**: `/users`  
❓ **Questions**: `/questions`  
📩 **Answers**: `/answer`  
🛠 **Votes**: `/votes`

[Full API Reference included above]

---

## ✨ Key Features

### 🔔 Real-time Notifications
- Socket.io events on: answer, vote, mention, acceptance

### 🔍 Search & Filtering
- MongoDB text search + tag-based filters + sort


### 🧠 Rich Editor Support
- HTML-safe content with sanitization and formatting
- Supports embedded links and inline images

### 👍 Voting System
- Backend-enforced duplicate prevention
- Auto reputation updates

---

## 🔐 Security Considerations

- **Auth**: JWT + Refresh Tokens
- **Roles**: Admin/User separation
- **Rate Limiting**: On auth-sensitive routes
- **Validation**: Frontend + backend schema checks
- **XSS/CORS/CSRF**: Via `helmet`, `cors`, sanitization


---

## 🚀 Performance Optimizations

- 🏷 **MongoDB Indexes**: Compound, text, sorted
- 📦 **Caching**: Redis support for sessions & hot queries
- 📁 **Image Optimization**: CDN, lazy loading
- 📃 **Pagination**: Efficient data loading on frontend
- 🧵 **Async Processing**: Event-driven architecture for votes and notifications

---

## 🔮 Future Scope

Here are some planned enhancements to make StackIt more robust and engaging:

- 📡 **Real-time Notifications for All Users**  
  Broadcast important updates and mentions across the platform using WebSockets.

- 🔖 **Bookmarking**  
  Save questions or answers for later review directly from the UI.

- 🚩 **Content Flagging and Reporting**  
  Let users report inappropriate content for admin moderation.
  ### 📷 Image Upload
- `Multer` + `Cloudinary` support  
- Frontend preview + backend compression

- 💸 **Donation System for Writers**  
  Enable users to financially support quality answer authors.

---

## 🛠 Setup Instructions

### 1️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in DB, JWT_SECRET, Cloudinary keys
npm run dev
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

> Make sure frontend `.env` points to the correct backend API URL (`VITE_API_URL=http://localhost:8000/api`)

---

## 📦 Tech Stack Summary

| Layer     | Technology              |
|-----------|--------------------------|
| Frontend  | React, React Router, TailwindCSS |
| Backend   | Node.js, Express, MongoDB |
| Realtime  | Socket.io                |
| Uploads   | Multer + Cloudinary      |
| Auth      | JWT, Bcrypt              |
| Deployment | Vercel (Frontend), Render / Railway / EC2 (Backend) |

---
