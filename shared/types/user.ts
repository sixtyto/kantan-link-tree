import { z } from "zod";

export type User = {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  lastLoginAt: Date;
};

export const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginUserSchema = createUserSchema.pick({
  email: true,
  password: true,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const updateProfileSchema = z
  .object({
    username: z.string().min(3).optional(),
    email: z.string().email().optional(),
  })
  .refine((data) => data.username !== undefined || data.email !== undefined, {
    message: "At least one of username or email must be provided",
    path: [],
  });
