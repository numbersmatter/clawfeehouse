# Clawfeehouse Store

Micro app for selling custom art commissions.

## Stack

- React Router framework mode
- Cloudflare Workers hosting
- Tailwind CSS v4
- Shared shadcn components from `@workspace/ui`

## Scripts

- `pnpm run dev` starts local dev server on `http://localhost:5176`
- `pnpm run build` builds the app
- `pnpm run preview` previews production build
- `pnpm run deploy` builds and deploys with Wrangler
- `pnpm run typecheck` regenerates Cloudflare + Router types and runs TypeScript

## Routes

- `/` storefront landing page with commission tiers
- `/commissions` request form for custom work
