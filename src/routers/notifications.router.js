import { Router } from "express";

import { getNotificationsController } from "../controllers/notifications.controller.js";

import { authenticate } from "../middlewares/authorization.js";

const notificationsRouter = Router();

notificationsRouter.get("/", authenticate, getNotificationsController);


export default notificationsRouter;