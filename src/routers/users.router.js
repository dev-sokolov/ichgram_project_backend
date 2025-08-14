import { Router } from "express";

import { authenticate } from "../middlewares/authorization.js";

import { getUserByIdController, updateUserDataController, getAllUsersController, getUsersByUsernameController } from "../controllers/users.controller.js";

import upload from "../middlewares/upload.js";

const usersRouter = Router();

usersRouter.get("/:id", getUserByIdController);

usersRouter.patch("/profile", authenticate, upload.single("avatar"), updateUserDataController);

usersRouter.get("/", getUsersByUsernameController);

export default usersRouter;