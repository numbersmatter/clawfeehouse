# db_drizzle

Shared database package for schema and migrations using Drizzle ORM with SQLite/D1-compatible SQL.

## Location

- Package path: `packages/db_drizzle`
- Schema: `src/schema/*.ts`
- Drizzle config: `drizzle.config.ts`
- Migrations output: `migrations/`
- Local persisted DB file: `data/development.sqlite`
- Cloudflare config: `wrangler.jsonc`

## Prerequisites

1. Install dependencies at the monorepo root:

```sh
pnpm install
```

2. Ensure the D1 database entry in `wrangler.jsonc` has the correct `database_id` for `db_clawfeehouse`.

## Local Development (Persisted SQLite)

This package uses `LOCAL_DB_PATH` with Drizzle Kit to migrate and inspect a persisted local SQLite file.

## Shared Local D1 Runtime State (All Apps)

All app dev servers now use one shared Cloudflare local D1 state directory:

- `packages/db_drizzle/data/wrangler-state/v3/d1/*.sqlite`

This keeps `auth_sso`, `admin`, and `gallery` on the same local D1 state during development.

Important distinction:

- Drizzle Kit local migration target: `packages/db_drizzle/data/development.sqlite`
- App runtime local D1 state (Wrangler/Miniflare): `packages/db_drizzle/data/wrangler-state/v3/d1/*.sqlite`

### Root helper commands

From repository root:

```sh
pnpm run db:shared:sync
pnpm run db:shared:prepare
pnpm run db:shared:migrate
pnpm run dev:apps:with-db
```

Reset shared app runtime D1 state:

```sh
pnpm run db:shared:reset
```

Where:

- `db:shared:prepare` migrates `packages/db_drizzle/data/development.sqlite` using Drizzle Kit.
- `db:shared:migrate` applies SQL migrations to Wrangler's shared local D1 state.
- `db:shared:sync` runs both in order.

### 1. Generate migration files from schema changes

From repository root:

```sh
pnpm --filter @workspace/db_drizzle run db:generate
```

Or from `packages/db_drizzle`:

```sh
pnpm run db:generate
```

### 2. Apply migrations to local persisted DB

From repository root:

```sh
pnpm --filter @workspace/db_drizzle run db:migrate:local
```

Or from `packages/db_drizzle`:

```sh
pnpm run db:migrate:local
```

This applies migrations into:

- `packages/db_drizzle/data/development.sqlite`

### 3. Open Drizzle Studio for local DB inspection

From repository root:

```sh
pnpm --filter @workspace/db_drizzle run db:studio
```

Or from `packages/db_drizzle`:

```sh
pnpm run db:studio
```

## Apply Schema to Remote Cloudflare D1

Drizzle generates SQL migrations. Wrangler applies those migrations to the remote D1 database.

### 1. Generate migrations (if schema changed)

```sh
pnpm --filter @workspace/db_drizzle run db:generate
```

### 2. Apply migrations to remote D1

Run from `packages/db_drizzle`:

```sh
pnpm exec wrangler d1 migrations apply db_clawfeehouse --remote --config wrangler.jsonc
```

Equivalent command from repository root:

```sh
pnpm --filter @workspace/db_drizzle exec wrangler d1 migrations apply db_clawfeehouse --remote --config wrangler.jsonc
```

### 3. (Optional) Apply migrations to local D1 preview DB managed by Wrangler

```sh
pnpm --filter @workspace/db_drizzle exec wrangler d1 migrations apply db_clawfeehouse --local --config wrangler.jsonc
```

## Common Workflow

After editing schema files:

```sh
pnpm --filter @workspace/db_drizzle run db:generate
pnpm --filter @workspace/db_drizzle run db:migrate:local
pnpm --filter @workspace/db_drizzle run db:studio
```

To run multiple apps with a shared local D1 runtime:

```sh
pnpm run db:shared:prepare
pnpm run dev:apps
```

When ready to deploy schema changes:

```sh
pnpm --filter @workspace/db_drizzle exec wrangler d1 migrations apply db_clawfeehouse --remote --config wrangler.jsonc
```

## Troubleshooting

### Native module version mismatch (`better-sqlite3`)

If local migration fails with `NODE_MODULE_VERSION` mismatch after switching Node versions, rebuild/reinstall dependencies from repo root:

```sh
pnpm install --force
```

Then retry:

```sh
pnpm --filter @workspace/db_drizzle run db:migrate:local
```
