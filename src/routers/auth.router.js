import { Router } from "express";

import { loginController, addUserController, logoutController, getCurrentController, verifyController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authorization.js";

const authRouter = Router();

authRouter.post("/registr", addUserController);

authRouter.post("/verify", verifyController);

authRouter.post("/login", loginController);

authRouter.get("/current", authenticate, getCurrentController);

authRouter.post("/logout", authenticate, logoutController);


export default authRouter;