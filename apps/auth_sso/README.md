# auth_sso

Central SSO app for Clawfeehouse, hosted at `https://auth.clawfeehouse.com`.

This app owns the shared authentication flow for:

- `https://admin.clawfeehouse.com`
- `https://gallery.clawfeehouse.com`

## Getting Started

## Development

Install dependencies from the monorepo root:

```bash
pnpm install
```

Run auth_sso locally:

```bash
pnpm --filter @clawfeehouse/auth_sso run dev
```

## Responsibilities

- Serve Better Auth API endpoints under `/api/auth/*`.
- Render auth UI routes: `/sign-in`, `/sign-up`, `/callback`, `/sign-out`.
- Validate return URLs to prevent open redirects.
- Redirect authenticated users back to app destinations:
  - admin -> `/dashboard`
  - gallery -> `/private`

## Required env vars

- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`
- `AUTH_COOKIE_DOMAIN`
- `BETTER_AUTH_TRUSTED_ORIGINS`

## Deploy

```bash
pnpm --filter @clawfeehouse/auth_sso run deploy
```
