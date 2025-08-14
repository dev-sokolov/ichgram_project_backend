import { getPostAggregationPipeline } from "../utils/postAggregation.js";

import cloudinary from "../utils/cloudinary.js";
import fs from "fs/promises";
import streamifier from "streamifier";

import Post from "../db/Post.js";
import User from "../db/User.js";

export const addPost = async ({ payload, file }) => {
  if (!file) {
    throw new Error("Image file is required");
  }

  let uploadResult;

  if (file.path) {
    uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: "kurs-project-posts",
      use_filename: true,
    });

    await fs.unlink(file.path);
  }
  else if (file.buffer) {
    uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "kurs-project-posts",
          use_filename: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  } else {
    throw new Error("File data not found");
  }

  const newPost = await Post.create({
    ...payload,
    image: uploadResult.secure_url,
    imageId: uploadResult.public_id
  });

  await User.findByIdAndUpdate(payload.author, {
    $push: { posts: newPost._id },
  }, { new: true });

  return newPost;
};

export const getPostsById = async (id) => {
  return Post.find({ author: id }).sort({ createdAt: -1 }).limit(6);
};

export const getOnePostById = async (id) => {
  const pipeline = getPostAggregationPipeline(id);
  const result = await Post.aggregate(pipeline);
  return result[0] || null;
};

export const deletePostById = async (id) => {
  const post = await Post.findById(id);

  if (post?.imageId) {
    await cloudinary.uploader.destroy(post.imageId);
  }

  return Post.findByIdAndDelete(id);
};

export const updatePostData = async ({ id, payload, file }) => {
  const post = await Post.findById(id);
  if (!post) throw new Error("Post not found");

  const updatedData = { ...payload };

  if (file) {
    let uploadResult;

    if (file.path) {
      uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "kurs-project-posts",
        use_filename: true,
      });
      await fs.unlink(file.path);
    } else if (file.buffer) {
      uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "kurs-project-posts",
            use_filename: true,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    } else {
      throw new Error("File data not found");
    }

    if (post.imageId) {
      await cloudinary.uploader.destroy(post.imageId);
    }

    updatedData.image = uploadResult.secure_url;
    updatedData.imageId = uploadResult.public_id;
  }

  return Post.findByIdAndUpdate(id, updatedData, { new: true });
};

export const getAllPosts = async () => {
  const pipeline = getPostAggregationPipeline();
  pipeline.unshift({ $sort: { createdAt: -1 } });
  return Post.aggregate(pipeline);
};


