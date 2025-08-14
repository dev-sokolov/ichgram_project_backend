import * as Yup from "yup";

export const messageAddSchema = Yup.object({
    sender: Yup.string().trim().min(2).required(),
    recipient: Yup.string().trim().min(2).required(),
    message: Yup.string().trim().min(1).required(),
})

