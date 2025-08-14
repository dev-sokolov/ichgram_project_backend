import * as Yup from "yup";

import { emailValidation, passwordValidation } from "../constants/user.constants.js";

export const emailSchema = Yup.string().trim().matches(emailValidation.value, emailValidation.message).required();

export const passwordSchema = Yup.string().trim().min(6).matches(passwordValidation.value, passwordValidation.message).required();

export const userAddSchema = Yup.object({
    email: emailSchema,
    fullName: Yup.string().trim().min(2).required(),
    username: Yup.string().trim().min(1).required(),
    password: passwordSchema,
});

export const userUpdateDataSchema = Yup.object({
    username: Yup.string().trim(),
    description: Yup.string().trim(),
    avatar: Yup.string().trim(),
})



