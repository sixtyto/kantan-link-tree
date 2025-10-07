import { eq, asc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const db = useDb();
  return await db
    .select()
    .from(tables.socialLinks)
    .where(eq(tables.socialLinks.userId, session.user.id))
    .orderBy(asc(tables.socialLinks.order));
});
