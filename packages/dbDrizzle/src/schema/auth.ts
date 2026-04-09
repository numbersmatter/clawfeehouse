import {
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import {
  autoIncrementId,
  createdAt,
  timestamp,
  updatedAt,
} from "../helpers";

export const sessions = sqliteTable(
  "sessions",
  {
    id: autoIncrementId("id"),
    userId: integer("userId")
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
    id: autoIncrementId("id"),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: integer("userId")
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
    id: autoIncrementId("id"),
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
  id: autoIncrementId("id"),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
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
