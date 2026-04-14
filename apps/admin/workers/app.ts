import { createRequestHandler } from "react-router";
import {
  createAuth,
  type AuthInstance,
} from "@workspace/auth/server";
import { createDb } from "@workspace/dbDrizzle/src/db";

interface AppSession {
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
}

interface AuthSessionResponse {
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
}

function resolveAuthHost(
  request: Request,
  configuredHost: string,
): string {
  const url = new URL(request.url);

  if (
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1"
  ) {
    return "http://localhost:5175";
  }

  return configuredHost;
}

function isPublicPath(pathname: string): boolean {
  return (
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/.well-known/") ||
    pathname.startsWith("/__vite") ||
    pathname.startsWith("/@") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt"
  );
}

function createAuthRedirect(
  request: Request,
  authHost: string,
): Response {
  const signInUrl = new URL("/sign-in", authHost);

  signInUrl.searchParams.set("app", "admin");
  signInUrl.searchParams.set(
    "redirectTo",
    new URL("/dashboard", request.url).toString(),
  );

  return Response.redirect(signInUrl.toString(), 302);
}

async function getSessionFromAuthHost(
  request: Request,
  authHost: string,
): Promise<AppSession | null> {
  const requestUrl = new URL(request.url);
  const sessionUrl = new URL(
    "/api/auth/get-session",
    authHost,
  );
  const response = await fetch(sessionUrl, {
    method: "GET",
    headers: {
      cookie: request.headers.get("cookie") ?? "",
      origin: requestUrl.origin,
      referer: request.url,
      "x-forwarded-host": requestUrl.host,
      "x-forwarded-proto": requestUrl.protocol.replace(
        ":",
        "",
      ),
    },
  });

  if (!response.ok) {
    return null;
  }

  const data =
    (await response.json()) as AuthSessionResponse;

  if (!data?.user?.id) {
    return null;
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
    },
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
    const auth = createAuth(db, env);
    const url = new URL(request.url);

    let session: AppSession | null = null;

    if (!isPublicPath(url.pathname)) {
      session = await getSessionFromAuthHost(
        request,
        resolveAuthHost(request, env.AUTH_SSO_URL),
      );

      if (!session) {
        return createAuthRedirect(
          request,
          resolveAuthHost(request, env.AUTH_SSO_URL),
        );
      }
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
      auth,
      session,
    });
  },
} satisfies ExportedHandler<Env>;
