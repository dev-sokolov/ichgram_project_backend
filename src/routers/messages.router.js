import { Router } from "express"

import { addMessageController, getConversationController, getShowcaseController } from "../controllers/messages.controller.js";

import { authenticate } from "../middlewares/authorization.js";

const messagesRouter = Router();

messagesRouter.get("/showcase", getShowcaseController);

messagesRouter.post("/:recipientId", authenticate, addMessageController);

messagesRouter.get("/:userId/conversation", authenticate, getConversationController);

export default messagesRouter;