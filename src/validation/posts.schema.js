import * as Yup from "yup";

export const postAddSchema = Yup.object({
    description: Yup.string().trim().min(2),
    image: Yup.string().trim(),
});

export const postUpdateDataSchema = Yup.object({
    description: Yup.string().trim().min(2),
    image: Yup.string().trim(),
})