const DEFAULT_TRUSTED_ORIGINS = [
  "https://auth.clawfeehouse.com",
  "https://admin.clawfeehouse.com",
  "https://gallery.clawfeehouse.com",
  "http://localhost:5175",
  "http://localhost:5173",
  "http://localhost:5174",
] as const;

export interface AuthEnvironment {
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_TRUSTED_ORIGINS?: string;
  BETTER_AUTH_ADMIN_USER_IDS?: string;
  AUTH_COOKIE_DOMAIN?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  DISCORD_CLIENT_ID?: string;
  DISCORD_CLIENT_SECRET?: string;
}

function parseCsv(value?: string): string[] {
  if (!value) return [];

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function resolveAuthEnvironment(
  env: Partial<AuthEnvironment>,
): AuthEnvironment {
  if (!env.BETTER_AUTH_SECRET) {
    throw new Error("BETTER_AUTH_SECRET is required");
  }

  if (!env.BETTER_AUTH_URL) {
    throw new Error("BETTER_AUTH_URL is required");
  }

  return {
    BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: env.BETTER_AUTH_URL,
    BETTER_AUTH_TRUSTED_ORIGINS:
      env.BETTER_AUTH_TRUSTED_ORIGINS,
    BETTER_AUTH_ADMIN_USER_IDS:
      env.BETTER_AUTH_ADMIN_USER_IDS,
    AUTH_COOKIE_DOMAIN: env.AUTH_COOKIE_DOMAIN,
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
    DISCORD_CLIENT_ID: env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: env.DISCORD_CLIENT_SECRET,
  };
}

export function getTrustedOrigins(
  env: AuthEnvironment,
): string[] {
  const configured = parseCsv(
    env.BETTER_AUTH_TRUSTED_ORIGINS,
  );

  return Array.from(
    new Set([...DEFAULT_TRUSTED_ORIGINS, ...configured]),
  );
}

export function getAdminUserIds(
  env: AuthEnvironment,
): string[] {
  return parseCsv(env.BETTER_AUTH_ADMIN_USER_IDS);
}

export interface OAuthProviderConfig {
  google?: {
    clientId: string;
    clientSecret: string;
  };
  discord?: {
    clientId: string;
    clientSecret: string;
  };
}

export function getOAuthProviderConfig(
  env: AuthEnvironment,
): OAuthProviderConfig {
  const config: OAuthProviderConfig = {};

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    config.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    };
  }

  if (env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET) {
    config.discord = {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    };
  }

  return config;
}
