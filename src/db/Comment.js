import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "post",
        required: true,
    },

}, { versionKey: false, timestamps: true });

const Comment = model("comment", commentSchema);

export default Comment;