PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_accounts`("id", "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", "scope", "password", "created_at", "updated_at") SELECT "id", "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", "scope", "password", "created_at", "updated_at" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `accounts_userId_idx` ON `accounts` (`userId`);--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`token` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("id", "userId", "token", "expiresAt", "ipAddress", "userAgent", "created_at", "updated_at") SELECT "id", "userId", "token", "expiresAt", "ipAddress", "userAgent", "created_at", "updated_at" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE INDEX `sessions_userId_idx` ON `sessions` (`userId`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`banned` integer DEFAULT false NOT NULL,
	`banReason` text,
	`banExpires` integer,
	`emailVerified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "role", "banned", "banReason", "banExpires", "emailVerified", "image", "created_at", "updated_at") SELECT "id", "name", "email", "role", "banned", "banReason", "banExpires", "emailVerified", "image", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `__new_verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_verifications`("id", "identifier", "value", "expiresAt", "created_at", "updated_at") SELECT "id", "identifier", "value", "expiresAt", "created_at", "updated_at" FROM `verifications`;--> statement-breakpoint
DROP TABLE `verifications`;--> statement-breakpoint
ALTER TABLE `__new_verifications` RENAME TO `verifications`;--> statement-breakpoint
CREATE INDEX `verifications_identifier_idx` ON `verifications` (`identifier`);