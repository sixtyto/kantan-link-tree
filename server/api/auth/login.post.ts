import { eq } from "drizzle-orm";
import { safeParse } from "zod";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validated = safeParse(loginUserSchema, body);

  if (!validated.success) {
    return createError({
      statusCode: 400,
      statusMessage: validated.error.message,
    });
  }

  const db = useDb();
  const user = await db.query.users.findFirst({
    where: eq(tables.users.email, validated.data.email),
  });

  if (!user) {
    return createError({
      statusCode: 400,
      statusMessage: "Invalid email or password",
    });
  }

  const verified = await verifyPassword(
    user.passwordHash,
    validated.data.password
  );

  if (!verified) {
    return createError({
      statusCode: 400,
      statusMessage: "Invalid email or password",
    });
  }

  db.update(tables.users)
    .set({
      lastLoginAt: new Date(),
    })
    .where(eq(tables.users.id, user.id));

  await setUserSession(event, {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt!,
    } satisfies User,
  });
});
