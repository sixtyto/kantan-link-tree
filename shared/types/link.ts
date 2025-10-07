import z from "zod";

export type Link = {
  id: string;
  url: string;
  title: string;
  description?: string;
  order: number;
  icon?: string;
  clicks?: number;
  isVisible?: boolean;
  updatedAt?: Date;
};

export const createLinkSchema = z.object({
  url: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().max(200).optional(),
  icon: z.string().optional(),
  isVisible: z.boolean().optional(),
});

export const updateLinkSchema = createLinkSchema;
