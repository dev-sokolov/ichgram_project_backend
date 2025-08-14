import { Router } from "express";

import { authenticate } from "../middlewares/authorization.js";

import { addPostController, getPostsFromUserByIdController, deletePostByIdController, getOnePostByIdController, updatePostDataController, getAllPostsController } from "../controllers/posts.controller.js";

import upload from "../middlewares/upload.js";

const postsRouter = Router();

postsRouter.post("/",authenticate, upload.single("image"), addPostController);

postsRouter.delete("/:id", authenticate, deletePostByIdController);

postsRouter.get("/user/:id", getPostsFromUserByIdController);

postsRouter.get("/:id", getOnePostByIdController);

postsRouter.patch("/:id",authenticate, upload.single("image"), updatePostDataController);

postsRouter.get("/", getAllPostsController);

export default postsRouter;