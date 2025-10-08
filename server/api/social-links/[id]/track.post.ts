import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const socialLinkId = getRouterParam(event, "id");

  if (!socialLinkId) {
    throw createError({
      statusCode: 400,
      message: "Social link ID is required",
    });
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";
  const rateLimitKey = `track:social:${socialLinkId}:${ip}`;

  const allowed = checkRateLimit(rateLimitKey);

  if (!allowed) {
    throw createError({
      statusCode: 429,
    });
  }

  const db = useDb();

  const result = await db
    .update(tables.socialLinks)
    .set({
      clicks: sql`${tables.socialLinks.clicks} + 1`,
    })
    .where(eq(tables.socialLinks.id, socialLinkId))
    .returning({
      id: tables.socialLinks.id,
      clicks: tables.socialLinks.clicks,
    });

  if (!result.length) {
    throw createError({
      statusCode: 404,
      message: "Social link not found",
    });
  }
});
