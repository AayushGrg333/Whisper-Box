import { z } from 'zod';

export const usernameValidation = z
    .string()
    .min(2,"Username must be atlest 2 characters")
    .max(20,"Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special charater");

export const signUpSchema = z.object({
    username : usernameValidation,
    email: z.string().email({message: "invaid email format"}),
    password: z.string().min(6, {message: "Password must be at least 6 charaters"})
})