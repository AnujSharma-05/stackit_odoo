import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType'
  },
  targetType: {
    type: String,
    required: true,
    enum: ['Question', 'Answer', 'Comment']
  },
  voteType: {
    type: String,
    required: true,
    enum: ['upvote', 'downvote']
  },
  weight: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  reason: {
    type: String,
    maxlength: [200, 'Vote reason cannot exceed 200 characters']
  },
  isActive: { type: Boolean, default: true },
  revokedAt: Date,
  revokedReason: String
}, {
  timestamps: true
});

// Compound indexes for uniqueness and performance
voteSchema.index({ user: 1, target: 1, targetType: 1 }, { unique: true });
voteSchema.index({ target: 1, targetType: 1, voteType: 1 });
voteSchema.index({ user: 1, createdAt: -1 });
voteSchema.index({ targetType: 1, createdAt: -1 });
export default mongoose.model('Vote', voteSchema);