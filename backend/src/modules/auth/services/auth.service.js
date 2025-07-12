import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../../user/models/User.js';
import PasswordResetToken from '../models/PasswordResetToken.js';
import { JWT_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from '../../../config/jwt.js';

class AuthService {
  // Generate JWT tokens
  generateTokens(userId, role) {
    const accessToken = jwt.sign(
      { userId, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId, role },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
  }

  // Register new user
  async register(userData) {
    try {
      const { username, email, password, role = 'user' } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        if (existingUser.email === email) {
          throw new Error('Email already registered');
        }
        if (existingUser.username === username) {
          throw new Error('Username already taken');
        }
      }

      // Create user (password will be hashed by User model pre-save hook)
      const user = new User({
        username,
        email,
        password,
        role
      });

      await user.save();

      // Generate tokens
      const tokens = this.generateTokens(user._id, user.role);

      // Return user without password
      const userResponse = await User.findById(user._id).select('-password');

      return {
        user: userResponse,
        ...tokens
      };
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async login(email, password, rememberMe = false) {
    try {
      // Find user with password
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is suspended or banned
      if (user.status === 'suspended') {
        throw new Error('Account suspended. Please contact support.');
      }

      if (user.status === 'banned') {
        throw new Error('Account banned. Please contact support.');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last seen
      user.lastSeen = new Date();
      await user.save();

      // Generate tokens with extended expiry if remember me is checked
      let tokens;
      if (rememberMe) {
        tokens = {
          accessToken: jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '30d' }
          ),
          refreshToken: jwt.sign(
            { userId: user._id, role: user.role },
            JWT_REFRESH_SECRET,
            { expiresIn: '90d' }
          )
        };
      } else {
        tokens = this.generateTokens(user._id, user.role);
      }

      // Return user without password
      const userResponse = await User.findById(user._id).select('-password');

      return {
        user: userResponse,
        ...tokens
      };
    } catch (error) {
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        throw new Error('User not found');
      }

      // Check if user is suspended or banned
      if (user.status === 'suspended' || user.status === 'banned') {
        throw new Error(`Account ${user.status}. Please contact support.`);
      }

      // Generate new tokens
      const tokens = this.generateTokens(user._id, user.role);

      return {
        user,
        ...tokens
      };
    } catch (error) {
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email, ipAddress, userAgent) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        // Don't reveal if email exists or not
        return { message: 'If the email exists, a password reset link has been sent.' };
      }

      // Check if user is suspended or banned
      if (user.status === 'suspended' || user.status === 'banned') {
        throw new Error(`Account ${user.status}. Please contact support.`);
      }

      // Generate reset token
      const { token, expiresAt } = await PasswordResetToken.generateResetToken(
        user._id,
        ipAddress,
        userAgent
      );

      // TODO: Send email with reset link
      // await emailService.sendPasswordResetEmail(user.email, token);

      return {
        message: 'Password reset link sent to your email.',
        token, // Remove this in production
        expiresAt // Remove this in production
      };
    } catch (error) {
      throw error;
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      // Verify token
      const tokenDoc = await PasswordResetToken.verifyResetToken(token);

      if (!tokenDoc) {
        throw new Error('Invalid or expired token');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update user password
      await User.findByIdAndUpdate(tokenDoc.user._id, {
        password: hashedPassword
      });

      // Mark token as used
      await tokenDoc.markAsUsed();

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId).select('+password');

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await User.findByIdAndUpdate(userId, {
        password: hashedPassword
      });

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;