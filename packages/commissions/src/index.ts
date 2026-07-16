import { and, desc, eq, inArray } from "drizzle-orm";

import type { Db } from "@workspace/db_drizzle/src/db";
import {
  commissionFiles,
  commissionMessages,
  commissionRequests,
  commissionStatusEvents,
  notificationOutbox,
  type InsertCommissionRequest,
} from "@workspace/db_drizzle/src/schema";

export type CommissionStatus =
  | "submitted"
  | "accepted"
  | "in_progress"
  | "delivered"
  | "declined"
  | "cancelled";

export interface CreateRequestInput {
  id: string;
  commissionerId: string;
  artistId: string;
  title: string;
  brief: string;
  budgetCents: number;
}

export class CommissionsService {
  constructor(private readonly db: Db) {}

  async createRequest(input: CreateRequestInput) {
    const payload: InsertCommissionRequest = {
      id: input.id,
      commissionerId: input.commissionerId,
      artistId: input.artistId,
      title: input.title,
      brief: input.brief,
      budgetCents: input.budgetCents,
      status: "submitted",
    };

    const [created] = await this.db
      .insert(commissionRequests)
      .values(payload)
      .returning();

    await this.db.insert(notificationOutbox).values({
      id: `${input.id}:submitted:${Date.now()}`,
      requestId: input.id,
      eventType: "commission.submitted",
      recipientUserId: input.artistId,
      payloadJson: JSON.stringify({
        title: input.title,
        budgetCents: input.budgetCents,
      }),
    });

    return created;
  }

  async listForCommissioner(commissionerId: string) {
    return this.db
      .select()
      .from(commissionRequests)
      .where(eq(commissionRequests.commissionerId, commissionerId))
      .orderBy(desc(commissionRequests.updatedAt));
  }

  async listForArtist(artistId: string) {
    return this.db
      .select()
      .from(commissionRequests)
      .where(eq(commissionRequests.artistId, artistId))
      .orderBy(desc(commissionRequests.updatedAt));
  }

  async updateStatus(input: {
    requestId: string;
    actorId: string;
    toStatus: CommissionStatus;
    note?: string;
  }) {
    const [existing] = await this.db
      .select()
      .from(commissionRequests)
      .where(eq(commissionRequests.id, input.requestId))
      .limit(1);

    if (!existing) {
      throw new Error("Commission request not found");
    }

    const [updated] = await this.db
      .update(commissionRequests)
      .set({ status: input.toStatus, updatedAt: new Date() })
      .where(eq(commissionRequests.id, input.requestId))
      .returning();

    await this.db.insert(commissionStatusEvents).values({
      id: `${input.requestId}:status:${Date.now()}`,
      requestId: input.requestId,
      actorId: input.actorId,
      fromStatus: existing.status,
      toStatus: input.toStatus,
      note: input.note,
    });

    return updated;
  }

  async addMessage(input: {
    id: string;
    requestId: string;
    senderId: string;
    body: string;
  }) {
    const [created] = await this.db
      .insert(commissionMessages)
      .values(input)
      .returning();

    return created;
  }

  async addFile(input: {
    id: string;
    requestId: string;
    uploadedById: string;
    name: string;
    storageUrl: string;
    mimeType: string;
    sizeBytes: number;
    visibility?: "shared" | "artist_only";
  }) {
    const [created] = await this.db
      .insert(commissionFiles)
      .values({
        ...input,
        visibility: input.visibility ?? "shared",
      })
      .returning();

    return created;
  }

  async getCommissionerTimeline(
    requestId: string,
    commissionerId: string,
  ) {
    const [request] = await this.db
      .select()
      .from(commissionRequests)
      .where(
        and(
          eq(commissionRequests.id, requestId),
          eq(commissionRequests.commissionerId, commissionerId),
        ),
      )
      .limit(1);

    if (!request) return null;

    const [events, messages, files] = await Promise.all([
      this.db
        .select()
        .from(commissionStatusEvents)
        .where(eq(commissionStatusEvents.requestId, requestId))
        .orderBy(desc(commissionStatusEvents.createdAt)),
      this.db
        .select()
        .from(commissionMessages)
        .where(eq(commissionMessages.requestId, requestId))
        .orderBy(desc(commissionMessages.createdAt)),
      this.db
        .select()
        .from(commissionFiles)
        .where(
          and(
            eq(commissionFiles.requestId, requestId),
            inArray(commissionFiles.visibility, ["shared"]),
          ),
        )
        .orderBy(desc(commissionFiles.createdAt)),
    ]);

    return {
      request,
      events,
      messages,
      files,
    };
  }
}
