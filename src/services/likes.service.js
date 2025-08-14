import Like from "../db/Like.js";
import Post from "../db/Post.js";

import { createNotification } from "./notifications.service.js";

export const toggleLike = async (userId, postId) => {
    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        return { message: "Лайк удален" };
    }

    const like = await Like.create({ user: userId, post: postId });
    const post = await Post.findById(postId);

    if (post && post.author.toString() !== userId.toString()) {
        await createNotification({
            recipient: post.author,
            sender: userId,
            type: "like",
            post: postId,
        });
    }

    return like;
}

export const getLikesCountByPost = async (postId) => {
    const count = await Like.countDocuments({ post: postId });
    return count;
};



