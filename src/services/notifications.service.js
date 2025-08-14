import Notification from "../db/Notification.js";

export const createNotification = async ({ recipient, sender, type, post = null }) => {
  if (recipient.toString() === sender.toString()) return null;

  const notification = new Notification({ recipient, sender, type, post });
  await notification.save();
  return notification;
};

export const getNotifications = async (userId) => {
  const notifications = await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .populate("sender", "username avatar")
    .populate("post", "image")
    .lean()
    .limit(15);

  return Array.isArray(notifications) ? notifications : [];
};