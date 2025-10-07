import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const linkId = getRouterParam(event, "id");

  if (!linkId) {
    throw createError({
      statusCode: 400,
      message: "Link ID is required",
    });
  }

  const db = useDb();

  const result = await db
    .update(tables.links)
    .set({
      clicks: sql`${tables.links.clicks} + 1`,
    })
    .where(eq(tables.links.id, linkId))
    .returning({ id: tables.links.id, clicks: tables.links.clicks });

  if (!result.length) {
    throw createError({
      statusCode: 404,
      message: "Link not found",
    });
  }
});
