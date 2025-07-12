import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: [
      'answer_received',
      'answer_accepted',
      'question_upvoted',
      'answer_upvoted',
      'question_commented',
      'answer_commented',
      'badge_earned',
      'reputation_milestone',
      'question_followed',
      'user_followed',
      'bounty_awarded',
      'bounty_expiring',
      'system_announcement',
      'moderation_action'
    ]
  },
  title: {
    type: String,
    required: true,
    maxlength: [200, 'Notification title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: true,
    maxlength: [1000, 'Notification message cannot exceed 1000 characters']
  },
  relatedModel: {
    type: String,
    enum: ['Question', 'Answer', 'User', 'Tag', 'Badge', 'Vote', 'Comment']
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel'
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  channel: {
    type: String,
    enum: ['in_app', 'email', 'push', 'sms'],
    default: 'in_app'
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  readAt: Date,
  actionUrl: String,
  actionText: String,
  expiresAt: Date,
  emailSent: { type: Boolean, default: false },
  emailSentAt: Date,
  pushSent: { type: Boolean, default: false },
  pushSentAt: Date
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1 });
notificationSchema.index({ sender: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
notificationSchema.index({ status: 1, priority: 1 });

export default mongoose.model('Notification', notificationSchema);