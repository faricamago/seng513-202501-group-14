// controllers/notificationController.js
import Notification from '../models/Notification.js';

export const getUserNotifications = async (req, res) => {
  const { username } = req.query;
  const notes = await Notification
    .find({ user: username, read: false })
    .sort({ createdAt: -1 })
    .populate('postId');
  res.json(notes);
};

export const markNotificationRead = async (req, res) => {
  const { id } = req.body;
  await Notification.findByIdAndUpdate(id, { read: true });
  res.json({ success: true });
};
