import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

import User from "../db/User.js"

const publicUserFields = "-password -token -verificationCode";

export const getUserById = (id) => User.findById(id).select(publicUserFields);

export const updateUserData = async ({ id, payload, files }) => {
  const user = await User.findById(id);
  if (!user) return null;

  if (files && files.length > 0) {
    const file = files[0];

    if (user.avatarId) {
      try {
        await cloudinary.uploader.destroy(user.avatarId);
      } catch (err) {
        console.warn("Не удалось удалить старый аватар в Cloudinary:", err.message);
      }
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "kurs-project-avatar", use_filename: true },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
    });

    payload.avatar = uploadResult.secure_url;
    payload.avatarId = uploadResult.public_id;
  }

  return User.findByIdAndUpdate(id, { $set: payload }, {
    new: true,
    runValidators: true,
  }).select(publicUserFields);
};

export const getAllUsers = () => User.find().select(publicUserFields).populate("posts");

export const getUsersByUsername = async (username) => {
  return User.find({
    username: { $regex: username, $options: "i" }
  }).select(publicUserFields);
};