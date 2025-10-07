import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const body = await readBody(event);

  const validated = createLinkSchema.safeParse(body);

  if (!validated.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validated.error.message,
    });
  }

  const db = useDb();
  const existingLinks = await db
    .select()
    .from(tables.links)
    .where(eq(tables.links.userId, session.user.id));

  const maxOrder =
    existingLinks.length > 0
      ? Math.max(...existingLinks.map((link) => link.order))
      : -1;

  const [newLink] = await db
    .insert(tables.links)
    .values({
      userId: session.user.id,
      url: validated.data.url,
      title: validated.data.title,
      description: validated.data.description,
      icon: validated.data.icon,
      order: maxOrder + 1,
    })
    .returning();

  return newLink;
});
