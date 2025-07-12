const passwordResetTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  hashedToken: {
    type: String,
    required: true,
    select: false
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0 // TTL index
  },
  usedAt: Date,
  isUsed: { type: Boolean, default: false },
  ipAddress: String,
  userAgent: String,
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 5 },
  lockedUntil: Date
}, {
  timestamps: true
});

// Indexes
passwordResetTokenSchema.index({ token: 1 });
passwordResetTokenSchema.index({ user: 1, isUsed: 1 });
passwordResetTokenSchema.index({ expiresAt: 1 });