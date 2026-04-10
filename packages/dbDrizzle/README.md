# dbDrizzle

Shared database package for schema and migrations using Drizzle ORM with SQLite/D1-compatible SQL.

## Location

- Package path: `packages/dbDrizzle`
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

### 1. Generate migration files from schema changes

From repository root:

```sh
pnpm --filter @workspace/dbDrizzle run db:generate
```

Or from `packages/dbDrizzle`:

```sh
pnpm run db:generate
```

### 2. Apply migrations to local persisted DB

From repository root:

```sh
pnpm --filter @workspace/dbDrizzle run db:migrate:local
```

Or from `packages/dbDrizzle`:

```sh
pnpm run db:migrate:local
```

This applies migrations into:

- `packages/dbDrizzle/data/development.sqlite`

### 3. Open Drizzle Studio for local DB inspection

From repository root:

```sh
pnpm --filter @workspace/dbDrizzle run db:studio
```

Or from `packages/dbDrizzle`:

```sh
pnpm run db:studio
```

## Apply Schema to Remote Cloudflare D1

Drizzle generates SQL migrations. Wrangler applies those migrations to the remote D1 database.

### 1. Generate migrations (if schema changed)

```sh
pnpm --filter @workspace/dbDrizzle run db:generate
```

### 2. Apply migrations to remote D1

Run from `packages/dbDrizzle`:

```sh
pnpm exec wrangler d1 migrations apply db_clawfeehouse --remote --config wrangler.jsonc
```

Equivalent command from repository root:

```sh
pnpm --filter @workspace/dbDrizzle exec wrangler d1 migrations apply db_clawfeehouse --remote --config wrangler.jsonc
```

### 3. (Optional) Apply migrations to local D1 preview DB managed by Wrangler

```sh
pnpm --filter @workspace/dbDrizzle exec wrangler d1 migrations apply db_clawfeehouse --local --config wrangler.jsonc
```

## Common Workflow

After editing schema files:

```sh
pnpm --filter @workspace/dbDrizzle run db:generate
pnpm --filter @workspace/dbDrizzle run db:migrate:local
pnpm --filter @workspace/dbDrizzle run db:studio
```

When ready to deploy schema changes:

```sh
pnpm --filter @workspace/dbDrizzle exec wrangler d1 migrations apply db_clawfeehouse --remote --config wrangler.jsonc
```

## Troubleshooting

### Native module version mismatch (`better-sqlite3`)

If local migration fails with `NODE_MODULE_VERSION` mismatch after switching Node versions, rebuild/reinstall dependencies from repo root:

```sh
pnpm install --force
```

Then retry:

```sh
pnpm --filter @workspace/dbDrizzle run db:migrate:local
```
