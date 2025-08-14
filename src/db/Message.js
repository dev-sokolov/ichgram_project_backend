import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,

    },
    recipient: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
}, { versionKey: false, timestamps: true });

const Message = model("message", messageSchema);

export default Message;