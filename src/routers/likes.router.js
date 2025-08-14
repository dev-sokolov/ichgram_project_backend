import { Router } from "express";

import { authenticate } from "../middlewares/authorization.js";

import { toggleLikeController, getLikesCountByPostController } from "../controllers/likes.controller.js";

const likesRouter = Router();

likesRouter.post("/:postId", authenticate, toggleLikeController);

likesRouter.get("/:postId", getLikesCountByPostController);

export default likesRouter;