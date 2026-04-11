import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";

export interface AuthClientOptions {
  baseURL: string;
  basePath?: string;
}

export function createClient({
  baseURL,
  basePath = "/api/auth",
}: AuthClientOptions) {
  return createAuthClient({
    baseURL,
    basePath,
    plugins: [adminClient()],
  });
}

export type AuthClient = ReturnType<typeof createClient>;
