import Message from "../db/Message.js";
import mongoose from "mongoose";

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
