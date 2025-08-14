import * as authService from "../services/auth.service.js";

import validateBody from "../utils/validateBody.js"

import { loginSchema, verifyCodeSchema } from "../validation/auth.schema.js"
import { userAddSchema } from "../validation/users.schema.js";

export const loginController = async (req, res) => {
    await validateBody(loginSchema, req.body);
    const result = await authService.login(req.body);

    res.json(result);
}

export const addUserController = async (req, res) => {
    await validateBody(userAddSchema, req.body);
    await authService.addUser(req.body);

    res.status(201).json({
        message: "User succeffully register. Please confirm email with link"
    });
};

export const verifyController = async (req, res) => {
    await validateBody(verifyCodeSchema, req.body);
    await authService.verify(req.body.code);

    res.json({
        message: "User successfully verify"
    })
}

export const getCurrentController = async (req, res) => {
    const result = await authService.getCurrent(req.user);

    res.json(result);
}

export const logoutController = async (req, res) => {
    await authService.logout(req.user);

    res.json({
        message: "Logout successfully"
    })
}