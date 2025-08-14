import multer from "multer";
import User from "../db/User.js";

const { JWT_SECRET } = process.env;
import jwt from "jsonwebtoken";

import HttpExeption from "../utils/HttpExeption.js";

const storage = multer.memoryStorage();

const limits = {
    fileSize: 1024 * 1024 * 10
};

const fileFilter = (req, file, callback) => {
    const extension = file.originalname.split(".").pop();
    if (extension === "exe") {
        throw (HttpExeption(400, ".exe file not allow"));
    }
    callback(null, true);
}

const upload = multer({
    storage,
    limits,
    fileFilter,
});

export const updateUserProfile = async (req, res) => {


    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace("Bearer ", "");

        const { id } = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" })
        }

        const { username, bio } = req.body;

        if (username) user.username = username;
        if (bio) user.bio = bio;

        if (req.file) {
            const base64Image = req.file.buffer.toString('base64');

            const base64EncodedImage = `data:${req.file.mimetype};base64,${base64Image}`;

            user.posts.push(base64EncodedImage);
        }

        const updateUser = await user.save();
        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json({ message: "Ошибка обновления профиля", error: error.message });
    }
};

export const uploadProfileImage = upload.single('profile_image');