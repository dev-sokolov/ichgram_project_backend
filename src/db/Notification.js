import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    type: {
        type: String,
        enum: ["like", "comment", "follow"],
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "post",
        default: null,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { versionKey: false, timestamps: true });

const Notification = model("notification", notificationSchema);

export default Notification;
