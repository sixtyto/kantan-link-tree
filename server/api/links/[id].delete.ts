import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Link ID is required",
    });
  }

  const db = useDb();
  const [deletedLink] = await db
    .delete(tables.links)
    .where(
      and(eq(tables.links.id, id), eq(tables.links.userId, session.user.id))
    )
    .returning();

  if (!deletedLink) {
    throw createError({
      statusCode: 404,
      message: "Link not found",
    });
  }
});
