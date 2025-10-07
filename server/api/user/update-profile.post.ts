import { eq, and, ne } from "drizzle-orm";
import type { z } from "zod";

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
    const validatedData = updateProfileSchema.safeParse(body);
    if (!validatedData.success) {
      throw createError({
        statusCode: 400,
        statusMessage: validatedData.error.message,
      });
    }

    const db = useDb();

    if (validatedData.data.username) {
      const existingUsername = await db.query.users.findFirst({
        where: and(
          ne(tables.users.id, session.user.id),
          eq(tables.users.username, validatedData.data.username)
        ),
      });

      if (existingUsername) {
        throw createError({
          statusCode: 400,
          statusMessage: "This username is already taken",
        });
      }
    }

    if (validatedData.data.email) {
      const existingEmail = await db.query.users.findFirst({
        where: and(
          ne(tables.users.id, session.user.id),
          eq(tables.users.email, validatedData.data.email)
        ),
      });

      if (existingEmail) {
        throw createError({
          statusCode: 400,
          statusMessage: "This email is already taken",
        });
      }
    }

    type UpdateProfileType = z.infer<typeof updateProfileSchema>;
    const updateData: UpdateProfileType = {};
    if (validatedData.data.username) {
      updateData.username = validatedData.data.username;
    }
    if (validatedData.data.email) {
      updateData.email = validatedData.data.email;
    }

    const [user] = await db
      .update(tables.users)
      .set(updateData)
      .where(eq(tables.users.id, session.user.id))
      .returning();

    await setUserSession(event, {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt!,
      } satisfies User,
    });
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update profile",
    });
  }
});
