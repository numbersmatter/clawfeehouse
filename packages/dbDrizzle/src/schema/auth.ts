import {
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import {
  createdAt,
  timestamp,
  updatedAt,
} from "../helpers";

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expiresAt").notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("sessions_userId_idx").on(table.userId),
  ],
);

export const accounts = sqliteTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp(
      "refreshTokenExpiresAt",
    ),
    scope: text("scope"),
    password: text("password"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("accounts_userId_idx").on(table.userId),
  ],
);

export const verifications = sqliteTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("verifications_identifier_idx").on(
      table.identifier,
    ),
  ],
);

// Table
export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"),
  banned: integer("banned", { mode: "boolean" })
    .notNull()
    .default(false),
  banReason: text("banReason"),
  banExpires: timestamp("banExpires"),
  emailVerified: integer("emailVerified", {
    mode: "boolean",
  })
    .notNull()
    .default(false),
  image: text("image"),
  createdAt,
  updatedAt,
});

export const users = usersTable;

// Types
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
