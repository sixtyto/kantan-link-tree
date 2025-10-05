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

    const body = await readBody(event);
    const validatedData = changePasswordSchema.safeParse(body);

    if (!validatedData.success) {
      throw createError({
        statusCode: 400,
        statusMessage: validatedData.error.message,
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

    const isCurrentPasswordValid = await verifyPassword(
      user.passwordHash,
      validatedData.data.currentPassword
    );

    if (!isCurrentPasswordValid) {
      throw createError({
        statusCode: 400,
        statusMessage: "Current password is incorrect",
      });
    }

    const hashedNewPassword = await hashPassword(
      validatedData.data.newPassword
    );

    await db
      .update(tables.users)
      .set({
        passwordHash: hashedNewPassword,
        lastLoginAt: new Date(),
      })
      .where(eq(tables.users.id, session.user.id));
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to change password",
    });
  }
});
