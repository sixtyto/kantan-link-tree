import { eq } from "drizzle-orm";
import { safeParse } from "zod";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const validated = safeParse(createUserSchema, body);

  if (!validated.success) {
    return createError({
      statusCode: 400,
      statusMessage: validated.error.message,
    });
  }

  const db = useDb();
  const username = await db.query.users.findFirst({
    where: eq(tables.users.username, validated.data.username),
  });

  if (username) {
    return createError({
      statusCode: 400,
      statusMessage: "Username already exists",
    });
  }

  const email = await db.query.users.findFirst({
    where: eq(tables.users.email, validated.data.email),
  });

  if (email) {
    return createError({
      statusCode: 400,
      statusMessage: "Email already exists",
    });
  }

  const passwordHash = await hashPassword(validated.data.password);

  const [user] = await db
    .insert(tables.users)
    .values({
      username: validated.data.username,
      email: validated.data.email,
      passwordHash: passwordHash,
      lastLoginAt: new Date(),
    })
    .returning();

  await setUserSession(event, {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      lastLoginAt: new Date(),
    } satisfies User,
  });
});
