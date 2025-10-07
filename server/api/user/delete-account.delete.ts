import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  try {
    const db = useDb();
    await db.delete(tables.users).where(eq(tables.users.id, session.user.id));
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete account",
    });
  }
});
