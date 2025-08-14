import * as usersService from "../services/users.service.js";

import HttpExeption from "../utils/HttpExeption.js";
import validateBody from "../utils/validateBody.js";

import { userUpdateDataSchema } from "../validation/users.schema.js";

export const getUserByIdController = async (req, res) => {
    const { id } = req.params;
    const result = await usersService.getUserById(id);
    if (!result) throw HttpExeption(404, `User with id=${id} not found`);

    res.json(result);
}

export const updateUserDataController = async (req, res) => {
    await validateBody(userUpdateDataSchema, req.body);

    const id = req.user._id;
    const result = await usersService.updateUserData({
        id,
        payload: req.body,
        files: req.file ? [req.file] : [],
    });

    if (!result) throw HttpExeption(404, `User with id=${id} not found`);
    res.json(result);
}

export const getAllUsersController = async (req, res) => {
    const result = await usersService.getAllUsers();

    res.json(result);
}

export const getUsersByUsernameController = async (req, res) => {
    const { username } = req.query;

    let result;
    if (username) {
        result = await usersService.getUsersByUsername(username);
    } else {
        result = await usersService.getAllUsers();
    }

    res.json(result);
};

