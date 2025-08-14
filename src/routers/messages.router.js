import { Router } from "express"

import { addMessageController, getConversationController } from "../controllers/messages.controller.js";

import { authenticate } from "../middlewares/authorization.js";

const messagesRouter = Router();

messagesRouter.post("/:recipientId", authenticate, addMessageController);

messagesRouter.get("/:userId/conversation", authenticate, getConversationController);

export default messagesRouter;