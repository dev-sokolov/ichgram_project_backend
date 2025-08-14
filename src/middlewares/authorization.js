import jwt from "jsonwebtoken";

import User from "../db/User.js";

import HttpExeption from "../utils/HttpExeption.js";

const { JWT_SECRET } = process.env;

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) throw HttpExeption(401, "Authorization header missing");

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") throw HttpExeption(401, "Bearer missing");

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      return next(HttpExeption(401, "User not found"));
    }

    req.user = user;

    next();
  } catch (error) {
    throw HttpExeption(401, error.message);
  }
};
