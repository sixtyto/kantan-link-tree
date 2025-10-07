import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Social link ID is required",
    });
  }

  const db = useDb();
  const [deletedLink] = await db
    .delete(tables.socialLinks)
    .where(
      and(
        eq(tables.socialLinks.id, id),
        eq(tables.socialLinks.userId, session.user.id)
      )
    )
    .returning();

  if (!deletedLink) {
    throw createError({
      statusCode: 404,
      message: "Social link not found",
    });
  }
});
