import Follow from "../db/Follow.js";
import User from "../db/User.js";

import { createNotification } from "./notifications.service.js";

import HttpExeption from "../utils/HttpExeption.js";

export const addFollower = async (follower, following) => {
    if (follower.toString() === following.toString()) throw HttpExeption(400, "Нельзя подписаться на себя");

    const existing = await Follow.findOne({ follower, following });
    if (existing) {
        throw HttpExeption(400, "Вы уже подписаны на этого пользователя");
    }

    await createNotification({
        recipient: following,
        sender: follower,
        type: "follow",
    })

    await User.findByIdAndUpdate(follower, {
        $addToSet: { followings: following },
    });

    await User.findByIdAndUpdate(following, {
        $addToSet: { followers: follower },
    });

    const result = await Follow.create({ follower, following });
    return result;
};

export const unfollowById = async (follower, following) => {
    const existing = await Follow.findOne({ follower, following });
    if (!existing) throw HttpExeption(400, "Подписка не найдена");

    await Follow.deleteOne({ follower, following });

    await User.findByIdAndUpdate(follower, {
        $pull: { followings: following },
    });

    await User.findByIdAndUpdate(following, {
        $pull: { followers: follower },
    });

    return { message: "Отписка успешна" };
}

export const getFollowers = async (userId) => {
    return await Follow.find({ following: userId }).populate("follower", "-password");
}

export const getFollowings = async (userId) => {
    return await Follow.find({ follower: userId }).populate("following", "-password");
}