import * as messagesService from "../services/messages.service.js"

import { messageAddSchema } from "../validation/messagesSchema.js";
import validateBody from "../utils/validateBody.js";

export const addMessageController = async (req, res, next) => {
    try {
        await validateBody(messageAddSchema, { ...req.body, sender: req.user._id, recipient: req.params.recipientId });

        const senderId = req.user._id;
        const { recipientId } = req.params;

        const payload = {
            sender: senderId,
            recipient: recipientId,
            message: req.body.message,
        };

        const created = await messagesService.addMessage(payload);

        const io = req.app.get("io");
        if (io) {
            io.to(recipientId.toString()).emit("new_message", created);
            io.to(senderId.toString()).emit("message_sent", created);
        }

        res.status(201).json(created);
    } catch (err) {
        next(err);
    }
};

export const getConversationController = async (req, res, next) => {
    try {
        const { userId } = req.params; 
        const userA = req.user._id;
        const userB = userId;
        const { limit = 50, page = 1 } = req.query;

        const messages = await messagesService.getConversation(userA, userB, { limit: Number(limit), page: Number(page) });
        res.json(messages);
    } catch (err) {
        next(err);
    }
};