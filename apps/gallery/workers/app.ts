import { createRequestHandler } from "react-router";
import {
  createAuth,
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

function isProtectedPath(pathname: string): boolean {
  return pathname === "/private";
}

function isAuthPath(pathname: string): boolean {
  return (
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/callback" ||
    pathname === "/sign-out"
  );
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

function createAuthRedirect(
  request: Request,
  authHost: string,
): Response {
  const signInUrl = new URL("/sign-in", authHost);

  signInUrl.searchParams.set("app", "gallery");
  signInUrl.searchParams.set(
    "redirectTo",
    new URL("/private", request.url).toString(),
  );

  return Response.redirect(signInUrl.toString(), 302);
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
    const authHost = resolveAuthHost(
      request,
      env.AUTH_SSO_URL,
    );

    if (isAuthPath(url.pathname)) {
      const redirectUrl = new URL(url.pathname, authHost);
      redirectUrl.search = url.search;

      return Response.redirect(redirectUrl.toString(), 302);
    }

    let session: AppSession | null = null;

    if (isProtectedPath(url.pathname)) {
      session = await getSessionFromAuthHost(
        request,
        authHost,
      );

      if (!session) {
        return createAuthRedirect(request, authHost);
      }
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
      auth,
      session,
    });
  },
} satisfies ExportedHandler<Env>;
