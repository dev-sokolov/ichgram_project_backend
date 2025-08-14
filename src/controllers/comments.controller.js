import * as commentsService from "../services/comments.service.js";

import validateBody from "../utils/validateBody.js";

import { commentAddSchema } from "../validation/commentsSchema.js";


export const addCommentController = async (req, res) => {
    await validateBody(commentAddSchema, req.body);

    const userId = req.user._id;
    const { postId } = req.params;

    const result = await commentsService.addComment(userId, postId, req.body);

    res.status(201).json(result);
}

export const getCommentsCountByPostController = async (req, res) => {
    const { postId } = req.params;
    const result = await commentsService.getCommentsCountByPost(postId);

    res.json(result);
}


export const getCommentsByPostController = async (req, res) => {
    const { postId } = req.params;
    const result = await commentsService.getCommentsByPost(postId);

    res.json(result);
}
