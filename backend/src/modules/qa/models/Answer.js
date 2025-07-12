import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Answer content is required'],
    minlength: [20, 'Answer must be at least 20 characters'],
    maxlength: [15000, 'Answer cannot exceed 15000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  metrics: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 }
  },
  isAccepted: { type: Boolean, default: false },
  acceptedAt: Date,
  media: {
    images: [{
      url: String,
      publicId: String,
      alt: String
    }],
    codeBlocks: [{
      language: String,
      code: String,
      filename: String
    }]
  },
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    createdAt: { type: Date, default: Date.now },
    upvotes: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }
  }],
  editHistory: [{
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    editedAt: { type: Date, default: Date.now },
    reason: String,
    previousContent: String
  }],
  moderation: {
    flagCount: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true }
  },
  status: {
    type: String,
    enum: ['active', 'deleted', 'hidden'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
answerSchema.index({ question: 1, 'metrics.score': -1 });
answerSchema.index({ author: 1, createdAt: -1 });
answerSchema.index({ isAccepted: 1, 'metrics.score': -1 });

export default mongoose.model('Answer', answerSchema);