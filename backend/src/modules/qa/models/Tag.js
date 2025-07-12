const mongoose = require('mongoose');

// 4. Tag Schema
const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [2, 'Tag name must be at least 2 characters'],
    maxlength: [50, 'Tag name cannot exceed 50 characters'],
    match: [/^[a-zA-Z0-9\-_]+$/, 'Tag name can only contain letters, numbers, hyphens, and underscores']
  },
  description: {
    type: String,
    maxlength: [500, 'Tag description cannot exceed 500 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  metrics: {
    questionCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 }
  },
  synonyms: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  color: {
    type: String,
    default: '#3b82f6',
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  },
  icon: String,
  isOfficial: { type: Boolean, default: false },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['active', 'deprecated', 'merged'],
    default: 'active'
  },
  mergedWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual for popularity score
tagSchema.virtual('popularityScore').get(function() {
  return this.metrics.questionCount * 0.7 + this.metrics.followersCount * 0.3;
});

// Indexes
tagSchema.index({ name: 1 });
tagSchema.index({ slug: 1 });
tagSchema.index({ 'metrics.questionCount': -1 });
tagSchema.index({ category: 1, status: 1 });
tagSchema.index({ status: 1, 'metrics.questionCount': -1 });

module.export = mongoose.model('Tag', tagSchema);