import type { Db } from "@workspace/dbDrizzle/src/db";
import { schema } from "@workspace/dbDrizzle/src/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins/admin";

import {
  getAdminUserIds,
  getOAuthProviderConfig,
  getTrustedOrigins,
  resolveAuthEnvironment,
  type AuthEnvironment,
} from "./env";

export type AuthInstance = ReturnType<typeof createAuth>;

export function createAuth(
  db: Db,
  envInput: Partial<AuthEnvironment>,
) {
  const env = resolveAuthEnvironment(envInput);
  const trustedOrigins = getTrustedOrigins(env);
  const adminUserIds = getAdminUserIds(env);
  const oauthProviders = getOAuthProviderConfig(env);
  const baseHost = new URL(env.BETTER_AUTH_URL).hostname;
  const isLocalHost =
    baseHost === "localhost" || baseHost === "127.0.0.1";
  const cookieDomain = isLocalHost
    ? undefined
    : env.AUTH_COOKIE_DOMAIN;

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
      usePlural: true,
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    trustedOrigins,
    advanced: {
      useSecureCookies: !isLocalHost,
      crossSubDomainCookies: {
        enabled: Boolean(cookieDomain),
        domain: cookieDomain,
      },
      disableCSRFCheck: false,
      disableOriginCheck: false,
    },
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }) => {
        console.info(
          `[auth] Password reset link for ${user.email}: ${url}`,
        );
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        console.info(
          `[auth] Verification link for ${user.email}: ${url}`,
        );
      },
    },
    socialProviders: {
      ...(oauthProviders.google
        ? { google: oauthProviders.google }
        : {}),
      ...(oauthProviders.discord
        ? { discord: oauthProviders.discord }
        : {}),
    },
    plugins: [
      admin({
        defaultRole: "user",
        adminRoles: ["admin"],
        adminUserIds,
      }),
    ],
  });
}
