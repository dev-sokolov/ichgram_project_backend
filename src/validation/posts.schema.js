import * as Yup from "yup";

export const postAddSchema = Yup.object({
    description: Yup.string().trim(),
    image: Yup.string().trim(),
});

export const postUpdateDataSchema = Yup.object({
    description: Yup.string().trim(),
    image: Yup.string().trim(),
})