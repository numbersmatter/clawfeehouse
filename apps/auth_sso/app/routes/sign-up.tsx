import { Form, Link, redirect } from "react-router";
import type { Route } from "./+types/sign-up";

import {
  getAuthCallbackUrl,
  getSafeRedirectTo,
  getSignInPath,
} from "~/utils/redirect";

async function readAuthError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as {
      message?: string;
      code?: string;
    };

    return data.message ?? data.code ?? "Sign up failed";
  } catch {
    return "Sign up failed";
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
    signInPath: getSignInPath(request.url),
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const app = String(formData.get("app") ?? "admin");
  const redirectTo = String(formData.get("redirectTo") ?? "");

  const safeRedirectTo = getSafeRedirectTo(
    `${request.url}?app=${encodeURIComponent(app)}&redirectTo=${encodeURIComponent(redirectTo)}`,
  );

  if (!name || !email || !password) {
    return {
      error: "Name, email, and password are required.",
      redirectTo: safeRedirectTo,
      app,
    };
  }

  const callbackURL = getAuthCallbackUrl(
    app,
    safeRedirectTo,
    request.url,
  );
  const endpoint = new URL("/api/auth/sign-up/email", request.url);
  const authRequest = new Request(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: request.headers.get("cookie") ?? "",
    },
    body: JSON.stringify({
      name,
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

export default function SignUp({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
      <div className="w-full space-y-6 rounded-xl border border-gray-200 bg-white p-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">Create account</h1>
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
            <span className="text-gray-700">Name</span>
            <input
              type="text"
              name="name"
              required
              className="w-full rounded-md border border-gray-300 text-gray-800 px-3 py-2"
            />
          </label>

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
              className="w-full rounded-md border border-gray-300 text-gray-800 px-3 py-2"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white"
          >
            Sign up
          </button>
        </Form>

        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link className="font-medium text-black" to={loaderData.signInPath}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
