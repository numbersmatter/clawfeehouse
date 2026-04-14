import { Form, Link, redirect } from "react-router";
import type { Route } from "./+types/sign-in";

import {
  getAuthCallbackUrl,
  getSafeRedirectTo,
  getSignUpPath,
} from "~/utils/redirect";

async function readAuthError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as {
      message?: string;
      code?: string;
    };

    return data.message ?? data.code ?? "Authentication failed";
  } catch {
    return "Authentication failed";
  }
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const redirectTo = getSafeRedirectTo(request.url);

  if (context.session) {
    return redirect(redirectTo);
  }

  const url = new URL(request.url);
  const app = url.searchParams.get("app") ?? "admin";

  return {
    app,
    redirectTo,
    signUpPath: getSignUpPath(request.url),
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const app = String(formData.get("app") ?? "admin");
  const redirectTo = String(formData.get("redirectTo") ?? "");

  const safeRedirectTo = getSafeRedirectTo(
    `${request.url}?app=${encodeURIComponent(app)}&redirectTo=${encodeURIComponent(redirectTo)}`,
  );

  if (!email || !password) {
    return {
      error: "Email and password are required.",
      redirectTo: safeRedirectTo,
      app,
    };
  }

  const callbackURL = getAuthCallbackUrl(
    app,
    safeRedirectTo,
    request.url,
  );
  const endpoint = new URL("/api/auth/sign-in/email", request.url);
  const authRequest = new Request(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: request.headers.get("cookie") ?? "",
      origin: requestUrl.origin,
      referer: request.url,
      "x-forwarded-host": requestUrl.host,
      "x-forwarded-proto": requestUrl.protocol.replace(":", ""),
    },
    body: JSON.stringify({
      email,
      password,
      callbackURL,
    }),
  });

  const authResponse = await context.auth.handler(authRequest);

  if (!authResponse.ok) {
    return {
      error: await readAuthError(authResponse),
      redirectTo: safeRedirectTo,
      app,
    };
  }

  const headers = new Headers();
  const setCookie = authResponse.headers.get("set-cookie");

  if (setCookie) {
    headers.set("set-cookie", setCookie);
  }

  return redirect(safeRedirectTo, { headers });
}

export default function SignIn({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
      <div className="w-full space-y-6 rounded-xl border border-gray-200 bg-white p-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
          <p className="text-sm text-gray-600">
            Continue to {loaderData.app === "gallery" ? "Gallery" : "Admin"}.
          </p>
        </header>

        {actionData?.error ? (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {actionData.error}
          </p>
        ) : null}

        <Form method="post" className="space-y-4">
          <input type="hidden" name="app" value={loaderData.app} />
          <input
            type="hidden"
            name="redirectTo"
            value={loaderData.redirectTo}
          />

          <label className="block space-y-1 text-sm">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white"
          >
            Sign in
          </button>
        </Form>

        <div className="space-y-2 text-sm">
          <p className="text-gray-600">Or continue with OAuth:</p>
          <div className="flex gap-3">
            <a
              className="rounded-md border border-gray-300 px-3 py-2"
              href={`/api/auth/sign-in/social?provider=google&callbackURL=${encodeURIComponent(
                getAuthCallbackUrl(
                  loaderData.app,
                  loaderData.redirectTo,
                  typeof window !== "undefined"
                    ? window.location.href
                    : undefined,
                ),
              )}`}
            >
              Google
            </a>
            <a
              className="rounded-md border border-gray-300 px-3 py-2"
              href={`/api/auth/sign-in/social?provider=discord&callbackURL=${encodeURIComponent(
                getAuthCallbackUrl(
                  loaderData.app,
                  loaderData.redirectTo,
                  typeof window !== "undefined"
                    ? window.location.href
                    : undefined,
                ),
              )}`}
            >
              Discord
            </a>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          No account?{" "}
          <Link className="font-medium text-black" to={loaderData.signUpPath}>
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
