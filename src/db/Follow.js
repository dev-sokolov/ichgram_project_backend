import { Schema, model } from "mongoose";

const followSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    following: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, { versionKey: false, timestamps: true });

followSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = model("follow", followSchema);

export default Follow;