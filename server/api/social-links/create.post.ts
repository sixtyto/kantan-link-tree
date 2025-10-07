import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const body = await readBody(event);

  const validated = createSocialLinkSchema.parse(body);

  const db = useDb();
  const existingLinks = await db
    .select()
    .from(tables.socialLinks)
    .where(eq(tables.socialLinks.userId, session.user.id));

  const maxOrder =
    existingLinks.length > 0
      ? Math.max(...existingLinks.map((link) => link.order))
      : -1;

  const [newLink] = await db
    .insert(tables.socialLinks)
    .values({
      userId: session.user.id,
      platform: validated.platform,
      url: validated.url,
      order: maxOrder + 1,
    })
    .returning();

  return newLink;
});
