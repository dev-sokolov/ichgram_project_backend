import * as likesService from "../services/likes.service.js";

export const toggleLikeController = async (req, res) => {
    const userId = req.user._id;
    const { postId } = req.params;

    const result = await likesService.toggleLike(userId, postId);

    res.status(201).json(result);
};

export const getLikesCountByPostController = async (req, res) => {
    const { postId } = req.params;
    const result = await likesService.getLikesCountByPost(postId);

    res.json(result);
}

