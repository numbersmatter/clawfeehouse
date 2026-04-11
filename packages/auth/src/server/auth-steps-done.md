I’m starting implementation now by first checking existing package conventions and Better Auth APIs in this repo so the new shared auth package compiles cleanly on the first pass.

Searched for regex `betterAuth|better-auth|drizzleAdapter|plugins/admin` (`**/*.{ts,tsx,js,mjs,cjs,json,md}`), 20 results

Read [](file:///Users/markmutt/code/clawfeehouse/packages/tsconfig)

Read [](file:///Users/markmutt/code/clawfeehouse/packages/tsconfig/base.json)

Read [](file:///Users/markmutt/code/clawfeehouse/packages/ui/package.json)

Read [](file:///Users/markmutt/code/clawfeehouse/packages/dbDrizzle/tsconfig.json)

Read [](file:///Users/markmutt/code/clawfeehouse/package.json)

I’m now checking the built-in Better Auth skill docs for concrete Drizzle adapter and plugin wiring so the package implementation matches the actual API signatures.

Read skill [create-auth-skill](file:///Users/markmutt/code/clawfeehouse/.agents/skills/create-auth-skill/SKILL.md?vscodeLinkType%3Dskill#1-1), lines 1 to 320

Read skill [organization-best-practices](file:///Users/markmutt/code/clawfeehouse/.agents/skills/organization-best-practices/SKILL.md?vscodeLinkType%3Dskill#1-1), lines 1 to 220

Read skill [email-and-password-best-practices](file:///Users/markmutt/code/clawfeehouse/.agents/skills/email-and-password-best-practices/SKILL.md?vscodeLinkType%3Dskill)

Before writing files, I’m checking the installed Better Auth package exports so we use the exact plugin import paths (`admin`, `adminClient`, adapter) that your installed version supports.

Ran terminal command: const p=require.resolve('better-auth/package.json');const j=require(p);console.log(p);console.log(JSON.stringify(j.exports,null,2));
Completed with input: const p=require.resolve('better-auth/package.json');const j=require(p);console.log(p);console.log(JSON.stringify(j.exports,null,2));

Ran terminal command: const p=require.resolve('better-auth/package.json');const j=require(p);console.log(p);console.log(Object.keys(j.exports||{}).slice(0,40).join('\n'));
Completed with input: const p=require.resolve('better-auth/package.json');const j=require(p);console.log(p);console.log(Object.keys(j.exports||{}).slice(0,40).join('\n'));

Ran terminal command: const path=require('path');const fs=require('fs');const entry=require.resolve('better-auth');const pkg=path.join(entry.split('node_modules/better-auth')[0],'node_modules/better-auth/package.json');const j=JSON.parse(fs.readFileSync(pkg,'utf8'));console.log('entry',entry);console.log('pkg',pkg);console.log(Object.keys(j.exports||{}).filter(k=>k.includes('plugin')||k.includes('adapter')||k.includes('client')||k==='.' ).sort().join('\n'));

Ran terminal command: cd /Users/markmutt/code/clawfeehouse && rg "declare const drizzleAdapter|function drizzleAdapter|declare const admin|export declare const admin" node_modules/.pnpm/better-auth@1.6.2_/node_modules/better-auth/dist -g "_.d.ts"
Completed with input: cd /Users/markmutt/code/clawfeehouse && rg "declare const drizzleAdapter|function drizzleAdapter|declare const admin|export declare const admin" node_modules/.pnpm/better-auth@1.6.2_/node_modules/better-auth/dist -g "_.d.ts"

Searched for regex `drizzleAdapter\(|export declare const admin|declare const admin` (`**/node_modules/.pnpm/**/better-auth/dist/**/*.d.ts`), no results

Ran terminal command: find node_modules -path '_better-auth/dist_' -name '\*.d.ts' | head -n 20

Ran terminal command: ls node_modules/.pnpm | grep '^better-auth@' | head -n 5

Ran terminal command: ls node*modules/.pnpm/better-auth@1.6.2*@opentelemetry+api@1.9.1_better-sqlite3@12.8.0_drizzle-kit@0.31.10_dr_749e6f3a605cbea5c1bc80b41742bd50/node_modules/better-auth/dist

Ran terminal command: grep -R "drizzleAdapter" node*modules/.pnpm/better-auth@1.6.2*@opentelemetry+api@1.9.1_better-sqlite3@12.8.0_drizzle-kit@0.31.10_dr_749e6f3a605cbea5c1bc80b41742bd50/node_modules/better-auth/dist -n | head -n 20

Ran terminal command: sed -n '1,220p' node*modules/.pnpm/better-auth@1.6.2*@opentelemetry+api@1.9.1_better-sqlite3@12.8.0_drizzle-kit@0.31.10_dr_749e6f3a605cbea5c1bc80b41742bd50/node*modules/better-auth/dist/adapters/drizzle/index.d.mts
Completed with input: sed -n '1,220p' node_modules/.pnpm/better-auth@1.6.2*@opentelemetry+api@1.9.1_better-sqlite3@12.8.0_drizzle-kit@0.31.10_dr_749e6f3a605cbea5c1bc80b41742bd50/node_modules/better-auth/dist/adapters/drizzle/index.d.mts

Ran terminal command: ls node*modules/.pnpm/better-auth@1.6.2*@opentelemetry+api@1.9.1_better-sqlite3@12.8.0_drizzle-kit@0.31.10_dr_749e6f3a605cbea5c1bc80b41742bd50/node_modules/better-auth/dist/adapters

Ran terminal command: sed -n '1,260p' node*modules/.pnpm/better-auth@1.6.2*@opentelemetry+api@1.9.1_better-sqlite3@12.8.0_drizzle-kit@0.31.10_dr_749e6f3a605cbea5c1bc80b41742bd50/node_modules/better-auth/dist/adapters/index.d.mts

Ran terminal command: ls node*modules/.pnpm/better-auth@1.6.2*@opentelemetry+api@1.9.1_better-sqlite3@12.8.0_drizzle-kit@0.31.10_dr_749e6f3a605cbea5c1bc80b41742bd50/node*modules/better-auth/dist/adapters/drizzle-adapter && sed -n '1,260p' node_modules/.pnpm/better-auth@1.6.2*@opentelemetry+api@1.9.1_better-sqlite3@12.8.0_drizzle-kit@0.31.10_dr_749e6f3a605cbea5c1bc80b41742bd50/node_modules/better-auth/dist/adapters/drizzle-adapter/index.d.mts

Ran terminal command: ls node_modules/.pnpm | grep '@better-auth+drizzle-adapter' && sed -n '1,260p' node_modules/.pnpm/@better-auth+drizzle-adapter@1.6.2_/node_modules/@better-auth/drizzle-adapter/dist/index.d.ts
Completed with input: ls node_modules/.pnpm | grep '@better-auth+drizzle-adapter' && sed -n '1,260p' node_modules/.pnpm/@better-auth+drizzle-adapter@1.6.2_/node_modules/@better-auth/drizzle-adapter/dist/index.d.ts

Ran terminal command: ls node*modules/.pnpm/@better-auth+drizzle-adapter@1.6.2*@better-auth+core@1.6.2_@better-auth+utils@0.4.0_@be*38a4fb0207987213711033499997e016/node_modules/@better-auth/drizzle-adapter/dist && sed -n '1,260p' node_modules/.pnpm/@better-auth+drizzle-adapter@1.6.2*@better-auth+core@1.6.2_@better-auth+utils@0.4.0_@be_38a4fb0207987213711033499997e016/node_modules/@better-auth/drizzle-adapter/dist/index.d.mts

Ran terminal command: sed -n '1,260p' node*modules/.pnpm/better-auth@1.6.2*@opentelemetry+api@1.9.1_better-sqlite3@12.8.0_drizzle-kit@0.31.10_dr_749e6f3a605cbea5c1bc80b41742bd50/node_modules/better-auth/dist/plugins/admin/index.d.mts

Ran terminal command: sed -n '1,320p' node*modules/.pnpm/better-auth@1.6.2*@opentelemetry+api@1.9.1_better-sqlite3@12.8.0_drizzle-kit@0.31.10_dr_749e6f3a605cbea5c1bc80b41742bd50/node_modules/better-auth/dist/plugins/admin/types.d.mts

Ran terminal command: grep -R "adminClient" node*modules/.pnpm/better-auth@1.6.2*@opentelemetry+api@1.9.1_better-sqlite3@12.8.0_drizzle-kit@0.31.10_dr_749e6f3a605cbea5c1bc80b41742bd50/node_modules/better-auth/dist/client -n | head -n 20

I’m now creating the new shared auth package with server/client entrypoints, Better Auth admin plugin wiring, dbDrizzle integration, and docs for how admin/gallery will consume it later.

Created [](file:///Users/markmutt/code/clawfeehouse/packages/auth/package.json)

Created [](file:///Users/markmutt/code/clawfeehouse/packages/auth/tsconfig.json)

Created [](file:///Users/markmutt/code/clawfeehouse/packages/auth/src/server)

Created [](file:///Users/markmutt/code/clawfeehouse/packages/auth/src/client)

Created [](file:///Users/markmutt/code/clawfeehouse/packages/auth/src/server/env.ts)

Created [](file:///Users/markmutt/code/clawfeehouse/packages/auth/src/server/auth.ts)

Created [](file:///Users/markmutt/code/clawfeehouse/packages/auth/src/server/session.ts)

Created [](file:///Users/markmutt/code/clawfeehouse/packages/auth/src/server/handler.ts)

Created [](file:///Users/markmutt/code/clawfeehouse/packages/auth/src/server/index.ts)

Core server scaffolding is in place; next I’m adding the client entrypoint, top-level exports, and package README, then I’ll run typecheck and fix any API/type mismatches.

Created [](file:///Users/markmutt/code/clawfeehouse/packages/auth/src/client/index.ts)

Created [](file:///Users/markmutt/code/clawfeehouse/packages/auth/src/index.ts)

Created [](file:///Users/markmutt/code/clawfeehouse/packages/auth/README.md)

Read changed files in [](file:///Users/markmutt/code/clawfeehouse)

I’m running install and a focused typecheck for the new auth package now to catch API/type issues immediately and fix them before we hand this off.

Ran terminal command: pnpm install

Ran terminal command: pnpm --filter @workspace/auth run typecheck
Completed with input: pnpm --filter @workspace/auth run typecheck

Generating patch (8 lines) in [](file:///Users/markmutt/code/clawfeehouse/packages/auth/src/server/session.ts)

```

```

Ran terminal command: pnpm --filter @workspace/auth run typecheck
Completed with input: pnpm --filter @workspace/auth run typecheck

Typecheck found portable type inference issues; I’ll add explicit return type annotations to the auth and client factories and re-run checks.

Generating patch (9 lines) in [](file:///Users/markmutt/code/clawfeehouse/packages/auth/src/server/auth.ts)

```

```

Generating patch (9 lines) in [](file:///Users/markmutt/code/clawfeehouse/packages/auth/src/client/index.ts)

```

```

Ran terminal command: pnpm --filter @workspace/auth run typecheck
Completed with input: pnpm --filter @workspace/auth run typecheck

Generating patch (12 lines) in [](file:///Users/markmutt/code/clawfeehouse/packages/auth/tsconfig.json)

```

```

Generating patch (9 lines) in [](file:///Users/markmutt/code/clawfeehouse/packages/auth/src/server/auth.ts)

```

```

Generating patch (9 lines) in [](file:///Users/markmutt/code/clawfeehouse/packages/auth/src/client/index.ts)

```

```

Ran terminal command: pnpm --filter @workspace/auth run typecheck

Read [](file:///Users/markmutt/code/clawfeehouse/packages/auth/src)

Read [](file:///Users/markmutt/code/clawfeehouse/packages/auth/src/server)

Implemented. A new shared auth package is now in place and wired to Better Auth + admin plugin + dbDrizzle, ready for future use by both admin and gallery apps.

What I added

1. New package scaffold:

- package.json
- tsconfig.json
- README.md

2. Server auth core (Better Auth + admin plugin + dbDrizzle adapter):

- auth.ts
- env.ts
- session.ts
- handler.ts
- index.ts

3. Client entrypoint:

- index.ts

4. Top-level exports:

- index.ts

What this implementation does

1. Uses dbDrizzle as the database source via Drizzle adapter.
2. Enables Better Auth admin plugin with role defaults:

- default role: user
- admin role list: admin
- optional admin user IDs via env

3. Enables email/password auth and password reset hook placeholders.
4. Adds Google and Discord OAuth scaffolding (enabled only when env vars are present).
5. Configures trusted origins for:

- auth.clawfeehouse.com
- admin.clawfeehouse.com
- gallery.clawfeehouse.com

6. Supports cross-subdomain cookies when AUTH_COOKIE_DOMAIN is set (for shared auth domain model).
7. Exposes reusable helpers for:

- auth route detection/handling
- session retrieval
- admin-session checks

Validation done

1. Workspace install completed successfully.
2. Auth package typecheck passed:

- pnpm --filter @workspace/auth run typecheck

Notes

1. I intentionally kept app integration non-invasive for now (no worker wiring changes yet), so admin/gallery can adopt this package incrementally.
2. README includes concrete Worker usage and env setup for your dedicated auth host plan.

Next natural step

1. Wire this package into a dedicated auth host worker endpoint at auth.clawfeehouse.com and add D1/auth env bindings in app wrangler configs.

Made changes.
