import Comment from "../db/Comment.js";
import Post from "../db/Post.js";
import { createNotification } from "./notifications.service.js";

import HttpExeption from "../utils/HttpExeption.js";

export const addComment = async (userId, postId, payload) => {
    const post = await Post.findById(postId);
    if (!post) throw HttpExeption(400, "Пост не найден");

    await createNotification({
        recipient: post.author,
        sender: userId,
        type: "comment",
        post: postId
    })
    const comment = await Comment.create({ user: userId, post: postId, ...payload });
    return await comment.populate("user", "-password -token");
}

export const getCommentsCountByPost = async (postId) => {
    const count = await Comment.countDocuments({ post: postId });
    return count;
};

export const getCommentsByPost = async (postId) => {
    const count = await Comment.find({ post: postId }).populate("user");
    return count;
};