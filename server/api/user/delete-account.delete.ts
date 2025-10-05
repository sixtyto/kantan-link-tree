import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event);
    if (!session?.user?.id) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const db = useDb();
    const user = await db.query.users.findFirst({
      where: eq(tables.users.id, session.user.id),
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    await db.delete(tables.users).where(eq(tables.users.id, session.user.id));

    return {
      success: true,
      message: "Account deleted successfully",
    };
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete account",
    });
  }
});
