// User Schema - Enhanced with reputation system
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password in queries
  },
  profile: {
    avatar: String,
    bio: { type: String, maxlength: 500 },
    location: String,
    website: String,
    social: {
      github: String,
      linkedin: String,
      twitter: String
    }
  },
  reputation: {
    type: Number,
    default: 0,
    min: 0
  },
  badges: [{
    name: String,
    description: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
    language: { type: String, default: 'en' }
  },
  stats: {
    questionsAsked: { type: Number, default: 0 },
    answersGiven: { type: Number, default: 0 },
    acceptedAnswers: { type: Number, default: 0 },
    totalVotes: { type: Number, default: 0 }
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'banned'],
    default: 'active'
  },
  lastSeen: { type: Date, default: Date.now },
  joinedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reputation level
userSchema.virtual('reputationLevel').get(function() {
  if (this.reputation >= 10000) return 'Expert';
  if (this.reputation >= 5000) return 'Advanced';
  if (this.reputation >= 1000) return 'Intermediate';
  if (this.reputation >= 100) return 'Beginner';
  return 'Newcomer';
});

// Indexes for performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ reputation: -1 });
userSchema.index({ 'stats.questionsAsked': -1 });
userSchema.index({ lastSeen: -1 });

userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next(); // if password is not modified, skip hashing
  // if password is modified, hash it
  
  // if (this.password.length < 6) {
  //     return next(new Error("Password must be at least 6 characters long"));
  // }
  
  this.password = await bcrypt.hash(this.password, 10)
  next()
}) // pre-save hook to hash password before saving into the database

userSchema.methods.isPasswordCorrect = async function (password) { // custom method to check password
  return await bcrypt.compare(password, this.password); // returns true or false (this.password is that which is in db)
}

module.export = mongoose.model('User', userSchema);