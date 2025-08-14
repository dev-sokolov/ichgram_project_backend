import * as Yup from "yup";

export const commentAddSchema = Yup.object({
    text: Yup.string().trim().min(2).required(),
})