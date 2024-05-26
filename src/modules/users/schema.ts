import { z } from 'zod'

export const userSchema = z
  .object({
    username: z.string().trim().min(1).max(30),
    password: z.string().trim().min(8).max(50),
  })
  .strict()
