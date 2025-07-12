import UserService from "../services/user.service.js";
const userService = new UserService();

const getCurrentUser = async (req, res, next) => {
    try {
        const userData = await userService.getCurrentUser(req.user.id);
        res.status(200).json({
        success: true,
        statusCode: 200,
        message: "User fetched successfully",
        data: userData
        });
    } catch (err) {
        next(err);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateProfile(req.user.id, req.validatedData);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Profile updated successfully",
            data: updatedUser,
        });
    } catch (err) {
        next(err);
    }
};

const getPublicProfile = async (req, res, next) => {
    try {
        const profile = await userService.getPublicProfile(req.params.username);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Public profile fetched successfully",
            data: profile,
        });
    } catch (err) {
        next(err);
    }
};


const getLeaderboard = async (req, res, next) => {
    try {
        const leaderboard = await userService.getLeaderboard();
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Leaderboard fetched successfully",
            data: leaderboard,
        });
    } catch (err) {
        next(err);
    }
};

const deactivateAccount = async (req, res, next) => {
    try {
        await userService.deactivateAccount(req.user.id);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Account deactivated successfully",
        });
    } catch (err) {
        next(err);
    }
};

export default {
    getCurrentUser,
    updateProfile,
    getPublicProfile,
    getLeaderboard,
    deactivateAccount
}