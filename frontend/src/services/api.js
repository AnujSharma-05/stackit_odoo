import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/users/me'),
  refreshToken: () => api.post('/auth/refresh-token'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  changePassword: (oldPassword, newPassword) => api.post('/auth/change-password', { oldPassword, newPassword }),
};

// Questions API
export const questionsAPI = {
  getQuestions: (params) => api.get('/questions', { params }),
  getQuestion: (id) => api.get(`/questions/${id}`),
  createQuestion: (questionData) => api.post('/questions', questionData),
  updateQuestion: (id, questionData) => api.put(`/questions/${id}`, questionData),
  deleteQuestion: (id) => api.delete(`/questions/${id}`),
  voteQuestion: (id, voteType) => api.post('/votes', { 
    target: id, 
    targetType: 'Question', 
    voteType: voteType === 'up' ? 'upvote' : 'downvote' 
  }),
};

// Answers API
export const answersAPI = {
  getAnswersByQuestion: (questionId) => api.get(`/answers/question/${questionId}`),
  createAnswer: (answerData) => api.post('/answers', answerData),
  updateAnswer: (id, answerData) => api.put(`/answers/${id}`, answerData),
  deleteAnswer: (id) => api.delete(`/answers/${id}`),
  acceptAnswer: (id) => api.post(`/answers/${id}/accept`),
  voteAnswer: (id, voteType) => api.post('/votes', { 
    target: id, 
    targetType: 'Answer', 
    voteType: voteType === 'up' ? 'upvote' : 'downvote' 
  }),
  // Note: Comments functionality not implemented in backend yet
  addComment: (id, content) => api.post(`/answers/${id}/comments`, { content }),
  deleteComment: (answerId, commentId) => api.delete(`/answers/${answerId}/comments/${commentId}`),
};

// Users API
export const usersAPI = {
  getProfile: (username) => api.get(`/users/profile/${username}`),
  updateProfile: (profileData) => api.put('/users/me', profileData),
  getLeaderboard: () => api.get('/users/leaderboard'),
  deactivateAccount: () => api.delete('/users/me'),
  // Note: Admin functionality not fully implemented in current backend
  getUsers: (params) => api.get('/users', { params }),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  updateUserStatus: (id, isActive) => api.put(`/users/${id}/status`, { isActive }),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Tags API
export const tagsAPI = {
  getTags: (params) => api.get('/tags', { params }),
  getTag: (id) => api.get(`/tags/${id}`),
  // Note: Create, update, delete operations not implemented in current backend
  getPopularTags: (params) => api.get('/tags/popular', { params }),
  createTag: (tagData) => api.post('/tags', tagData),
  updateTag: (id, tagData) => api.put(`/tags/${id}`, tagData),
  deleteTag: (id) => api.delete(`/tags/${id}`),
};

// Votes API - New voting system
export const votesAPI = {
  vote: (targetId, targetType, voteType) => api.post('/votes', { targetId, targetType, voteType }),
  removeVote: (targetId, targetType) => api.delete(`/votes/${targetId}/${targetType}`),
};

export default api;
