const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters'],
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Category description is required'],
    maxlength: [1000, 'Category description cannot exceed 1000 characters']
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  path: {
    type: String,
    default: ''
  },
  icon: String,
  color: {
    type: String,
    default: '#6b7280',
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  },
  image: {
    url: String,
    publicId: String,
    alt: String
  },
  metrics: {
    questionCount: { type: Number, default: 0 },
    tagCount: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    followerCount: { type: Number, default: 0 }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  moderation: {
    moderators: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    isModerated: { type: Boolean, default: false },
    autoApprove: { type: Boolean, default: true }
  },
  permissions: {
    canCreateQuestions: { type: Boolean, default: true },
    minReputationToAsk: { type: Number, default: 0 },
    minReputationToAnswer: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'hidden'],
    default: 'active'
  },
  displayOrder: { type: Number, default: 0 },
  isDefault: { type: Boolean, default: false },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual for full path
categorySchema.virtual('fullPath').get(function() {
  return this.path + '/' + this.slug;
});

// Indexes
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1, displayOrder: 1 });
categorySchema.index({ level: 1, status: 1 });
categorySchema.index({ 'metrics.questionCount': -1 });
categorySchema.index({ status: 1, displayOrder: 1 });

module.exports = mongoose.model('Category', categorySchema);