import User from "../db/User.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

import sendEmailWithNodemailer from "../utils/sendEmailWithNodemailer.js";

import HttpExeption from "../utils/HttpExeption.js";

const { JWT_SECRET, FRONTEND_URL } = process.env;

const createToken = (user) => {
    const payload = {
        id: user._id
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
    return token;
};

export const login = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) throw HttpExeption(401, `User not found`);

    if (!user.verify) {
        throw HttpExeption(403, "Please verify your email before logging in");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) throw HttpExeption(401, "Password invalid");

    const token = createToken(user);
    user.token = token;
    await user.save();

    return {
        token,
        user: {
            email: user.email,
            fullName: user.fullName,
        },
    };
};

export const addUser = async (data) => {
    const { email, password, username } = data;
    const userEmail = await User.findOne({ email });
    if (userEmail) throw HttpExeption(400, `This email is already taken.`);

    const userUsername = await User.findOne({ username });
    if (userUsername) throw HttpExeption(400, `This username is already taken.`);

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationCode = nanoid();
    const newUser = await User.create({ ...data, password: hashPassword, verificationCode });

    const verifyEmail = {
        to: email,
        // to: "vaquero1master@gmail.com",
        subject: "Verify email",
        html: `
            <h1>Verify your email</h1>
            <p>Click the link below to verify your account:</p>
            <a href="${FRONTEND_URL}?verificationCode=${verificationCode}" target="_blank">Verify Email</a>
        `
    };

    await sendEmailWithNodemailer(verifyEmail);

    return newUser;
};

export const verify = async (code) => {
    const user = await User.findOne({ verificationCode: code });
    if (!user) throw HttpExeption(401, "Email already verified or not found");
    user.verificationCode = "";
    user.verify = true;
    await user.save();
}


export const getCurrent = async user => {
    return {
        token: user.token,
        user: {
            email: user.email,
            fullName: user.fullName,
        },
    };
};

export const logout = async ({ _id }) => {
    const user = await User.findById(_id);
    if (!user) throw HttpExeption(401, `User not found`);
    user.token = "";
    await user.save();
}

