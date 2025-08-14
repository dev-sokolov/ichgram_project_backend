import { Router } from "express"

import { addCommentController, getCommentsCountByPostController, getCommentsByPostController } from "../controllers/comments.controller.js";

import { authenticate } from "../middlewares/authorization.js";

const commentsRouter = Router();

commentsRouter.post("/:postId", authenticate, addCommentController);

commentsRouter.get("/:postId", getCommentsCountByPostController);

commentsRouter.get("/fromPost/:postId", getCommentsByPostController);

export default commentsRouter;