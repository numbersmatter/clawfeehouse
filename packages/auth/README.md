# auth

Shared Better Auth package for Clawfeehouse apps.

This package is intended to be consumed by both admin and gallery apps, with auth endpoints hosted on `auth.clawfeehouse.com`.

## What this package provides

- Better Auth server initializer using `@workspace/dbDrizzle`.
- Better Auth admin plugin enabled for role-aware admin access.
- Email/password auth + password reset hooks.
- Google + Discord OAuth provider scaffolding.
- Session helpers for route loader/action guards.
- A client factory with `adminClient()` plugin support.

## Environment variables

Required:

- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL` (for example `https://auth.clawfeehouse.com`)

Optional:

- `BETTER_AUTH_TRUSTED_ORIGINS` (comma-separated extra origins)
- `BETTER_AUTH_ADMIN_USER_IDS` (comma-separated user ids)
- `AUTH_COOKIE_DOMAIN` (for example `.clawfeehouse.com`)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`

Default trusted origins include:

- `https://auth.clawfeehouse.com`
- `https://admin.clawfeehouse.com`
- `https://gallery.clawfeehouse.com`

## Usage from a Worker

```ts
import { createDb } from "@workspace/dbDrizzle/src/db";
import {
  createAuth,
  handleAuthRequest,
  isAuthRoute,
} from "@workspace/auth/server";

export default {
  async fetch(request, env, ctx) {
    const db = createDb(env.db_clawfeehouse);
    const auth = createAuth(db, env);

    if (isAuthRoute(request)) {
      return handleAuthRequest(auth, request);
    }

    // Continue with your app request handler...
  },
};
```

## Session guard helpers

```ts
import {
  getSession,
  requireAdminSession,
} from "@workspace/auth/server";

const session = await getSession(auth, request);
const adminSession = await requireAdminSession(
  auth,
  request,
);
```

## Client usage

```ts
import { createClient } from "@workspace/auth/client";

export const authClient = createClient({
  baseURL: "https://auth.clawfeehouse.com",
});
```

## Notes

- `sendResetPassword` and `sendVerificationEmail` are currently console-backed placeholders and should be replaced with your email provider.
- `AUTH_COOKIE_DOMAIN=.clawfeehouse.com` enables cross-subdomain session cookies for admin/gallery.
- Keep CSRF and origin checks enabled in production.
