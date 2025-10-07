import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Link ID is required",
    });
  }

  const validated = updateLinkSchema.safeParse(body);

  if (!validated.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validated.error.message,
    });
  }

  const db = useDb();
  const [updatedLink] = await db
    .update(tables.links)
    .set({
      url: validated.data.url,
      title: validated.data.title,
      description: validated.data.description,
      icon: validated.data.icon,
      isVisible: validated.data.isVisible,
      updatedAt: new Date(),
    })
    .where(
      and(eq(tables.links.id, id), eq(tables.links.userId, session.user.id))
    )
    .returning();

  if (!updatedLink) {
    throw createError({
      statusCode: 404,
      message: "Link not found",
    });
  }

  return updatedLink;
});
