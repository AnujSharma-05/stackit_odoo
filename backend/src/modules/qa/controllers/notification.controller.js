import Notification from '../models/Notification.js';
import { ApiResponse } from '../../../shared/utils/ApiResponse.js';
import { ApiError } from '../../../shared/utils/ApiError.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';

const notificationController = {
  // Get notifications for current user
  getNotifications: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user._id;

    const filter = { recipient: userId };
    if (status) {
      filter.status = status;
    }

    const notifications = await Notification.find(filter)
      .populate('sender', 'username displayName avatar')
      .populate('relatedId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(filter);

    const result = {
      docs: notifications,
      totalDocs: total,
      limit: parseInt(limit),
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    };

    res.status(200).json(
      new ApiResponse(200, result, 'Notifications retrieved successfully')
    );
  }),

  // Get unread notification count
  getUnreadCount: asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const count = await Notification.countDocuments({
      recipient: userId,
      status: 'unread'
    });

    res.status(200).json(
      new ApiResponse(200, { count }, 'Unread count retrieved successfully')
    );
  }),

  // Mark notification as read
  markAsRead: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { status: 'read', readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    res.status(200).json(
      new ApiResponse(200, notification, 'Notification marked as read')
    );
  }),

  // Mark all notifications as read
  markAllAsRead: asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await Notification.updateMany(
      { recipient: userId, status: 'unread' },
      { status: 'read', readAt: new Date() }
    );

    res.status(200).json(
      new ApiResponse(200, {}, 'All notifications marked as read')
    );
  }),

  // Delete notification
  deleteNotification: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipient: userId
    });

    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    res.status(200).json(
      new ApiResponse(200, {}, 'Notification deleted successfully')
    );
  }),

  // Create notification (internal use)
  createNotification: asyncHandler(async (notificationData) => {
    const notification = await Notification.create(notificationData);
    return notification;
  })
};

export default notificationController;
