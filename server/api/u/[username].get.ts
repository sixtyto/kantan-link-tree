import { eq, and, asc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, "username");

  if (!username) {
    throw createError({
      statusCode: 400,
      message: "Username is required",
    });
  }

  const db = useDb();

  const [user] = await db
    .select({
      id: tables.users.id,
      username: tables.users.username,
    })
    .from(tables.users)
    .where(eq(tables.users.username, username))
    .limit(1);

  if (!user) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }

  const [profile] = await db
    .select({
      name: tables.profiles.name,
      bio: tables.profiles.bio,
      avatar: tables.profiles.avatar,
      theme: tables.profiles.theme,
      background: tables.profiles.background,
      fontColor: tables.profiles.fontColor,
    })
    .from(tables.profiles)
    .where(eq(tables.profiles.userId, user.id))
    .limit(1);

  const userLinks = await db
    .select({
      id: tables.links.id,
      url: tables.links.url,
      title: tables.links.title,
      description: tables.links.description,
      icon: tables.links.icon,
      clicks: tables.links.clicks,
    })
    .from(tables.links)
    .where(
      and(eq(tables.links.userId, user.id), eq(tables.links.isVisible, true))
    )
    .orderBy(asc(tables.links.order));

  const userSocialLinks = await db
    .select({
      id: tables.socialLinks.id,
      platform: tables.socialLinks.platform,
      url: tables.socialLinks.url,
    })
    .from(tables.socialLinks)
    .where(eq(tables.socialLinks.userId, user.id))
    .orderBy(asc(tables.socialLinks.order));

  return {
    username: user.username,
    profile,
    links: userLinks,
    socialLinks: userSocialLinks,
  };
});
