import { eq, and } from "drizzle-orm";
import { z } from "zod";

const updateSocialLinkSchema = z.object({
  url: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Social link ID is required",
    });
  }

  const validated = updateSocialLinkSchema.parse(body);

  const db = useDb();
  const [updatedLink] = await db
    .update(tables.socialLinks)
    .set({
      url: validated.url,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(tables.socialLinks.id, id),
        eq(tables.socialLinks.userId, session.user.id)
      )
    )
    .returning();

  if (!updatedLink) {
    throw createError({
      statusCode: 404,
      message: "Social link not found",
    });
  }

  return updatedLink;
});
