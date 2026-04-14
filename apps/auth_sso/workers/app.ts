import { createRequestHandler } from "react-router";
import {
  createAuth,
  getSession,
  handleAuthRequest,
  isAuthRoute,
  type AuthInstance,
} from "@workspace/auth/server";
import { createDb } from "@workspace/db_drizzle/src/db";

interface AppSession {
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
}

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
    auth: AuthInstance;
    session: AppSession | null;
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    const db = createDb(env.db_clawfeehouse);
    const requestUrl = new URL(request.url);
    const isLocalHostRequest =
      requestUrl.hostname === "localhost" ||
      requestUrl.hostname === "127.0.0.1";

    const auth = createAuth(
      db,
      isLocalHostRequest
        ? {
            ...env,
            BETTER_AUTH_URL: requestUrl.origin,
            AUTH_COOKIE_DOMAIN: undefined,
          }
        : env,
    );

    if (isAuthRoute(request)) {
      return handleAuthRequest(auth, request);
    }

    const session = (await getSession(
      auth,
      request,
    )) as AppSession | null;

    return requestHandler(request, {
      cloudflare: { env, ctx },
      auth,
      session,
    });
  },
} satisfies ExportedHandler<Env>;
