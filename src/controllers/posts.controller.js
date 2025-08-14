import * as postsService from "../services/posts.service.js"
import User from "../db/User.js";
import validateBody from "../utils/validateBody.js";

import HttpExeption from "../utils/HttpExeption.js";

import { postAddSchema, postUpdateDataSchema } from "../validation/posts.schema.js";

export const addPostController = async (req, res) => {
    await validateBody(postAddSchema, req.body);

    if (!req.file) {
        throw HttpExeption(400, "Image file is required");
    }

    const result = await postsService.addPost({
        payload: {
            ...req.body,
            author: req.user._id,
        },
        file: req.file,
    });

    res.status(201).json(result);
}

export const getPostsFromUserByIdController = async (req, res) => {
    const { id } = req.params;
    const result = await postsService.getPostsById(id);

    res.json(result);
}

export const deletePostByIdController = async (req, res) => {
    const { id } = req.params; 
    const userId = req.user._id.toString(); 

    const result = await postsService.getOnePostById(id)
    
    if (!result) throw HttpExeption(404, `Post with id=${id} not found`);

    if (result.author._id.toString() !== userId) {
        throw HttpExeption(403, "You are not authorized to delete this post");
    }

    const deletedPost = await postsService.deletePostById(id);

    await User.findByIdAndUpdate(userId, {
        $pull: { posts: id }
    });

    res.json(deletedPost._id)
};

export const getOnePostByIdController = async (req, res) => {
    const { id } = req.params;
    const result = await postsService.getOnePostById(id);

    res.json(result);
}

export const updatePostDataController = async (req, res) => {
    await validateBody(postUpdateDataSchema, req.body);
    const { id } = req.params;

    const userId = req.user._id.toString();

    const post = await postsService.getOnePostById(id);

    if (!post) throw HttpExeption(404, `Post with id=${id} not found`);
    if (post.author._id.toString() !== userId.toString()) {
        throw HttpExeption(403, "You are not authorized to update this post");
    }

    const result = await postsService.updatePostData({
        id,
        payload: req.body,
        file: req.file,
    });

    res.json(result);
}

export const getAllPostsController = async (req, res) => {
    const result = await postsService.getAllPosts();

    res.json(result);
};

