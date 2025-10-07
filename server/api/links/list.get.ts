import { eq, asc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const db = useDb();

  return await db
    .select()
    .from(tables.links)
    .where(eq(tables.links.userId, session.user.id))
    .orderBy(asc(tables.links.order));
});
