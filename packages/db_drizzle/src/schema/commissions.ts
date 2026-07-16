import { eq, and, desc } from "drizzle-orm";
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
import { users } from "./auth";

export const commissionRequests = sqliteTable(
  "commission_requests",
  {
    id: text("id").primaryKey(),
    commissionerId: text("commissionerId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    artistId: text("artistId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    brief: text("brief").notNull(),
    budgetCents: integer("budgetCents").notNull(),
    status: text("status")
      .notNull()
      .default("submitted"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("commission_requests_commissioner_idx").on(
      table.commissionerId,
    ),
    index("commission_requests_artist_idx").on(
      table.artistId,
    ),
    index("commission_requests_status_idx").on(table.status),
  ],
);

export const commissionMessages = sqliteTable(
  "commission_messages",
  {
    id: text("id").primaryKey(),
    requestId: text("requestId")
      .notNull()
      .references(() => commissionRequests.id, {
        onDelete: "cascade",
      }),
    senderId: text("senderId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt,
  },
  (table) => [
    index("commission_messages_request_idx").on(
      table.requestId,
    ),
    index("commission_messages_sender_idx").on(table.senderId),
  ],
);

export const commissionFiles = sqliteTable(
  "commission_files",
  {
    id: text("id").primaryKey(),
    requestId: text("requestId")
      .notNull()
      .references(() => commissionRequests.id, {
        onDelete: "cascade",
      }),
    uploadedById: text("uploadedById")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    storageUrl: text("storageUrl").notNull(),
    mimeType: text("mimeType").notNull(),
    sizeBytes: integer("sizeBytes").notNull(),
    visibility: text("visibility")
      .notNull()
      .default("shared"),
    createdAt,
  },
  (table) => [
    index("commission_files_request_idx").on(table.requestId),
    index("commission_files_uploaded_by_idx").on(
      table.uploadedById,
    ),
  ],
);

export const commissionStatusEvents = sqliteTable(
  "commission_status_events",
  {
    id: text("id").primaryKey(),
    requestId: text("requestId")
      .notNull()
      .references(() => commissionRequests.id, {
        onDelete: "cascade",
      }),
    actorId: text("actorId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fromStatus: text("fromStatus"),
    toStatus: text("toStatus").notNull(),
    note: text("note"),
    createdAt,
  },
  (table) => [
    index("commission_status_events_request_idx").on(
      table.requestId,
    ),
    index("commission_status_events_created_idx").on(
      table.createdAt,
    ),
  ],
);

export const notificationOutbox = sqliteTable(
  "notification_outbox",
  {
    id: text("id").primaryKey(),
    requestId: text("requestId")
      .notNull()
      .references(() => commissionRequests.id, {
        onDelete: "cascade",
      }),
    eventType: text("eventType").notNull(),
    recipientUserId: text("recipientUserId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    payloadJson: text("payloadJson").notNull(),
    sentAt: timestamp("sentAt"),
    createdAt,
  },
  (table) => [
    index("notification_outbox_request_idx").on(
      table.requestId,
    ),
    index("notification_outbox_recipient_idx").on(
      table.recipientUserId,
    ),
    index("notification_outbox_sent_idx").on(table.sentAt),
  ],
);

export type CommissionRequest =
  typeof commissionRequests.$inferSelect;
export type InsertCommissionRequest =
  typeof commissionRequests.$inferInsert;
export type CommissionMessage =
  typeof commissionMessages.$inferSelect;
export type CommissionFile =
  typeof commissionFiles.$inferSelect;
export type CommissionStatusEvent =
  typeof commissionStatusEvents.$inferSelect;

interface DbLike {
  select: (...args: any[]) => any;
  insert: (...args: any[]) => any;
}

export async function listRequestsForCommissioner(
  db: DbLike,
  commissionerId: string,
) {
  return db
    .select()
    .from(commissionRequests)
    .where(eq(commissionRequests.commissionerId, commissionerId))
    .orderBy(desc(commissionRequests.updatedAt));
}

export async function listRequestsForArtist(
  db: DbLike,
  artistId: string,
) {
  return db
    .select()
    .from(commissionRequests)
    .where(eq(commissionRequests.artistId, artistId))
    .orderBy(desc(commissionRequests.updatedAt));
}

export async function getRequestForUser(
  db: DbLike,
  requestId: string,
  userId: string,
) {
  const rows = await db
    .select()
    .from(commissionRequests)
    .where(
      and(
        eq(commissionRequests.id, requestId),
        eq(commissionRequests.commissionerId, userId),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}
