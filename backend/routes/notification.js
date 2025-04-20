// routes/notifications.js
import express from 'express';
import {
  getUserNotifications,
  markNotificationRead
} from '../controllers/notificationController.js';

const router = express.Router();
router.get('/', getUserNotifications);
router.post('/read', markNotificationRead);
export default router;
