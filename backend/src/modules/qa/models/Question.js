import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true,
    minlength: [10, 'Title must be at least 10 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Question description is required'],
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [10000, 'Description cannot exceed 10000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }],
    validate: {
      validator: function(tags) {
        return tags.length >= 1 && tags.length <= 5;
      },
      message: 'Question must have between 1 and 5 tags'
    }
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  acceptedAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
    default: null
  },
  bounty: {
    points: { type: Number, default: 0 },
    expiresAt: Date,
    isActive: { type: Boolean, default: false }
  },
  metrics: {
    views: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    score: { type: Number, default: 0 }, // upvotes - downvotes
    answerCount: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 }
  },
  media: {
    images: [{
      url: String,
      publicId: String,
      alt: String
    }],
    attachments: [{
      filename: String,
      url: String,
      size: Number,
      type: String
    }]
  },
  seo: {
    metaDescription: String,
    keywords: [String]
  },
  moderation: {
    flagCount: { type: Number, default: 0 },
    flags: [{
      reason: String,
      reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reportedAt: { type: Date, default: Date.now }
    }],
    isApproved: { type: Boolean, default: true },
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    moderatedAt: Date
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'deleted', 'duplicate'],
    default: 'active'
  },
  duplicateOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  },
  lastActivity: { type: Date, default: Date.now },
  pinnedAt: Date,
  featuredAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Complex indexes for search and performance
questionSchema.index({ 
  title: 'text', 
  description: 'text',
  'seo.keywords': 'text'
}, {
  weights: {
    title: 10,
    description: 5,
    'seo.keywords': 8
  }
});

questionSchema.index({ tags: 1, status: 1 });
questionSchema.index({ author: 1, createdAt: -1 });
questionSchema.index({ 'metrics.score': -1, createdAt: -1 });
questionSchema.index({ status: 1, lastActivity: -1 });
questionSchema.index({ category: 1, difficulty: 1 });

export default mongoose.model('Question', questionSchema);