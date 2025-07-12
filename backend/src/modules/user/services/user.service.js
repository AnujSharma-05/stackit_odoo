import User from "../models/User.js";

export default class UserService {
  // Get logged-in user info
async getCurrentUser(userId) {
    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new Error(404, "User not found");
    }

    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        preferences: user.preferences,
        stats: user.stats,
        reputation: user.reputation,
        role: user.role,
        status: user.status,
        joinedAt: user.joinedAt,
        lastSeen: user.lastSeen,
    };
}

  // Update profile
async updateProfile(userId, updates) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error(404, "User not found");
    }

    if (updates.username) user.username = updates.username;
    if (updates.email) user.email = updates.email;
    if (updates.profile) user.profile = { ...user.profile, ...updates.profile };
    if (updates.preferences)
    user.preferences = { ...user.preferences, ...updates.preferences };

    await user.save();
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        preferences: user.preferences,
        stats: user.stats,
        reputation: user.reputation,
        role: user.role,
        status: user.status,
        joinedAt: user.joinedAt,
        lastSeen: user.lastSeen,
    };
}

  // Get public profile by username
async getPublicProfile(username) {
    const user = await User.findOne({ username }).select(
        "-password -email -preferences"
    );
    if (!user) {
        throw new Error(404, "User not found");
    }

    return {
        _id: user._id,
        username: user.username,
        profile: user.profile,
        stats: user.stats,
        reputation: user.reputation,
        role: user.role,
        joinedAt: user.joinedAt,
        lastSeen: user.lastSeen,
    };
}

  // Get top users by reputation
async getLeaderboard() {
    const users = await User.find({ status: "active" })
        .sort({ reputation: -1 })
        .limit(20)
        .select("username reputation profile badges stats");

    return users;
}

  // Deactivate user account
async deactivateAccount(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error(404, "User not found");
    }

    user.status = "suspended"; // or 'banned' if you want permanent
    await user.save();
    return true;
}}