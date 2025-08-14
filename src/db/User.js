import { Schema, model } from "mongoose";

import { emailValidation } from "../constants/user.constants.js";

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        match: emailValidation.value,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    avatar: {
        type: String,
        default: "",
    },
    avatarId: {
        type: String,
        default: "",
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "post",
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: "follow",
    }],
    followings: [{
        type: Schema.Types.ObjectId,
        ref: "follow",
    }],
    description: {
        type: String,
    },
    link: {
        type: String,
    },
    images: [{
        type: String,
    }],
    verificationCode: {
        type: String,
    },
    verify: {
        type: Boolean,
        default: false,
    },

}, { versionKey: false, timestamps: true });

const User = model("user", userSchema);

export default User;