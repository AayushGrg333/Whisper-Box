import { z } from 'zod';

export const messageSchema = z.object({
    content:z
    .string()
    .min(10,{message:"content must be atlest 10 charaters "})
    .max(200,{message: "content must be no longer thant  300 charaters"})
});

