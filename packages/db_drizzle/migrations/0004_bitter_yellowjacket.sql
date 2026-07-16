CREATE TABLE `commission_files` (
	`id` text PRIMARY KEY NOT NULL,
	`requestId` text NOT NULL,
	`uploadedById` text NOT NULL,
	`name` text NOT NULL,
	`storageUrl` text NOT NULL,
	`mimeType` text NOT NULL,
	`sizeBytes` integer NOT NULL,
	`visibility` text DEFAULT 'shared' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`requestId`) REFERENCES `commission_requests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uploadedById`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `commission_files_request_idx` ON `commission_files` (`requestId`);--> statement-breakpoint
CREATE INDEX `commission_files_uploaded_by_idx` ON `commission_files` (`uploadedById`);--> statement-breakpoint
CREATE TABLE `commission_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`requestId` text NOT NULL,
	`senderId` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`requestId`) REFERENCES `commission_requests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `commission_messages_request_idx` ON `commission_messages` (`requestId`);--> statement-breakpoint
CREATE INDEX `commission_messages_sender_idx` ON `commission_messages` (`senderId`);--> statement-breakpoint
CREATE TABLE `commission_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`commissionerId` text NOT NULL,
	`artistId` text NOT NULL,
	`title` text NOT NULL,
	`brief` text NOT NULL,
	`budgetCents` integer NOT NULL,
	`status` text DEFAULT 'submitted' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`commissionerId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`artistId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `commission_requests_commissioner_idx` ON `commission_requests` (`commissionerId`);--> statement-breakpoint
CREATE INDEX `commission_requests_artist_idx` ON `commission_requests` (`artistId`);--> statement-breakpoint
CREATE INDEX `commission_requests_status_idx` ON `commission_requests` (`status`);--> statement-breakpoint
CREATE TABLE `commission_status_events` (
	`id` text PRIMARY KEY NOT NULL,
	`requestId` text NOT NULL,
	`actorId` text NOT NULL,
	`fromStatus` text,
	`toStatus` text NOT NULL,
	`note` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`requestId`) REFERENCES `commission_requests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`actorId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `commission_status_events_request_idx` ON `commission_status_events` (`requestId`);--> statement-breakpoint
CREATE INDEX `commission_status_events_created_idx` ON `commission_status_events` (`created_at`);--> statement-breakpoint
CREATE TABLE `notification_outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`requestId` text NOT NULL,
	`eventType` text NOT NULL,
	`recipientUserId` text NOT NULL,
	`payloadJson` text NOT NULL,
	`sentAt` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`requestId`) REFERENCES `commission_requests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipientUserId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `notification_outbox_request_idx` ON `notification_outbox` (`requestId`);--> statement-breakpoint
CREATE INDEX `notification_outbox_recipient_idx` ON `notification_outbox` (`recipientUserId`);--> statement-breakpoint
CREATE INDEX `notification_outbox_sent_idx` ON `notification_outbox` (`sentAt`);