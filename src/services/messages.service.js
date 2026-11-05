import Message from "../db/Message.js";
import mongoose from "mongoose";
import User from "../db/User.js";

import { SHOWCASE_VIEWER_USERNAME } from "../constants/demoAccount.js";

export const addMessage = async (payload) => {
    const result = await Message.create(payload);
    return result;
}

export const getConversation = async (userA, userB, { limit = 50, page = 1 } = {}) => {
  const skip = (page - 1) * limit;

  const senderId = new mongoose.Types.ObjectId(userA);
  const recipientId = new mongoose.Types.ObjectId(userB);

  const messages = await Message.find({
    $or: [
      { sender: senderId, recipient: recipientId },
      { sender: recipientId, recipient: senderId }
    ]
  })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);

  return messages;
};

export const getShowcaseConversations = async () => {
  const users = await User.find({ accountType: "showcase" })
    .select("username fullName avatar")
    .lean();

  if (!users.length) {
    return { viewer: null, contacts: [], conversations: {} };
  }

  const viewer = users.find((user) => user.username === SHOWCASE_VIEWER_USERNAME) || users[0];
  const viewerId = String(viewer._id);
  const allowedIds = new Set(users.map((user) => String(user._id)));

  const messages = await Message.find({
    sender: { $in: users.map((user) => user._id) },
    recipient: { $in: [...allowedIds] },
  })
    .sort({ createdAt: 1 })
    .lean();

  const conversations = {};
  const contactIds = new Set();

  for (const message of messages) {
    const senderId = String(message.sender);
    const recipientId = String(message.recipient);
    if (!allowedIds.has(senderId) || !allowedIds.has(recipientId)) continue;

    const otherId = senderId === viewerId
      ? recipientId
      : recipientId === viewerId
        ? senderId
        : null;

    if (!otherId) continue;

    contactIds.add(otherId);
    if (!conversations[otherId]) conversations[otherId] = [];
    conversations[otherId].push({
      _id: message._id,
      sender: senderId,
      recipient: recipientId,
      message: message.message,
      createdAt: message.createdAt,
    });
  }

  return {
    viewer: {
      _id: viewerId,
      username: viewer.username,
      fullName: viewer.fullName,
      avatar: viewer.avatar || "",
    },
    contacts: users
      .filter((user) => contactIds.has(String(user._id)))
      .map((user) => ({
        _id: String(user._id),
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar || "",
      })),
    conversations,
  };
};
