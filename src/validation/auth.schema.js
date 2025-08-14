import Yup from "yup";

import { emailSchema, passwordSchema } from "./users.schema.js";

export const verifyCodeSchema = Yup.object({
    code: Yup.string().trim().required(),
})

export const loginSchema = Yup.object({
    email: emailSchema,
    password: passwordSchema,
});