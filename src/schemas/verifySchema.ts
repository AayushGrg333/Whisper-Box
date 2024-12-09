import { z } from 'zod';
export const verifySchema = z.object({
    username: z.string(),
    verificationCode: z.string().length(6), // Example field
  });
  