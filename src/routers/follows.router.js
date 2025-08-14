import { Router } from "express";

import { addFollowerController, unfollowByIdController, getFollowersController, getFollowingController } from "../controllers/follows.controller.js";

import { authenticate } from "../middlewares/authorization.js";

const followsRouter = Router();

followsRouter.get("/followers/:userId", getFollowersController);

followsRouter.get("/followings/:userId", getFollowingController);

followsRouter.post("/:followingId", authenticate, addFollowerController);

followsRouter.delete("/:followingId", authenticate, unfollowByIdController);

export default followsRouter;