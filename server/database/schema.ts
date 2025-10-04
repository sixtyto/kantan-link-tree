import { relations } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  uuid,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const themeEnum = pgEnum("theme", ["light", "dark", "custom"]);

export const socialPlatformEnum = pgEnum("social_platform", [
  "youtube",
  "twitter",
  "tiktok",
  "instagram",
  "github",
  "email",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .unique()
    .notNull(),
  name: text("name").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  theme: themeEnum("theme").default("light"),
  background: text("background"),
  fontColor: text("font_color"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const socialLinks = pgTable("social_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  platform: socialPlatformEnum("platform").notNull(),
  url: text("url").notNull(),
  order: integer("order").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const links = pgTable("links", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  url: text("url").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  icon: text("icon"),
  clicks: integer("clicks").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  links: many(links),
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  socialLinks: many(socialLinks),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const socialLinksRelations = relations(socialLinks, ({ one }) => ({
  user: one(users, {
    fields: [socialLinks.userId],
    references: [users.id],
  }),
}));

export const linksRelations = relations(links, ({ one }) => ({
  user: one(users, {
    fields: [links.userId],
    references: [users.id],
  }),
}));
