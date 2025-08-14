import { Schema, model } from "mongoose";

const postSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    imageId: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, { versionKey: false, timestamps: true });

const Post = model("post", postSchema);

export default Post;