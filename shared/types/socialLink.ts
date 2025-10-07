import { z } from "zod";

export enum SocialPlatform {
  YOUTUBE = "youtube",
  TWITTER = "twitter",
  TIKTOK = "tiktok",
  INSTAGRAM = "instagram",
  GITHUB = "github",
  EMAIL = "email",
}

export type SocialLink = {
  id: string;
  platform: SocialPlatform;
  url: string;
  order?: number;
  updatedAt?: Date;
};

export const createSocialLinkSchema = z.object({
  platform: z.enum([
    SocialPlatform.YOUTUBE,
    SocialPlatform.TWITTER,
    SocialPlatform.TIKTOK,
    SocialPlatform.INSTAGRAM,
    SocialPlatform.GITHUB,
    SocialPlatform.EMAIL,
  ]),
  url: z.string(),
  order: z.number().optional(),
});

export const updateSocialLinkSchema = createSocialLinkSchema;
