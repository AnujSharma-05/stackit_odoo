import mongoose from "mongoose";

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
    required: true
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
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static methods
passwordResetTokenSchema.statics.generateResetToken = async function(userId, ipAddress, userAgent) {
  const crypto = await import('crypto');
  const token = crypto.default.randomBytes(32).toString('hex');
  const hashedToken = crypto.default.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  
  const resetToken = new this({
    user: userId,
    token,
    hashedToken,
    expiresAt,
    ipAddress,
    userAgent
  });
  
  await resetToken.save();
  return { token, expiresAt };
};

passwordResetTokenSchema.statics.verifyResetToken = async function(token) {
  const crypto = await import('crypto');
  const hashedToken = crypto.default.createHash('sha256').update(token).digest('hex');
  
  return await this.findOne({
    hashedToken,
    expiresAt: { $gt: new Date() },
    isUsed: false
  }).populate('user');
};

passwordResetTokenSchema.methods.markAsUsed = async function() {
  this.isUsed = true;
  this.usedAt = new Date();
  return await this.save();
};

export default mongoose.model('PasswordResetToken', passwordResetTokenSchema);