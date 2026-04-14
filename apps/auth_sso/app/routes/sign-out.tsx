import { Form, redirect } from "react-router";
import type { Route } from "./+types/sign-out";

import { getSafeRedirectTo } from "~/utils/redirect";

export async function action({ request, context }: Route.ActionArgs) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const app = String(formData.get("app") ?? "admin");
  const redirectTo = String(formData.get("redirectTo") ?? "");

  const safeRedirectTo = getSafeRedirectTo(
    `${request.url}?app=${encodeURIComponent(app)}&redirectTo=${encodeURIComponent(redirectTo)}`,
  );

  const endpoint = new URL("/api/auth/sign-out", request.url);
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
  });

  const authResponse = await context.auth.handler(authRequest);
  const headers = new Headers();
  const setCookie = authResponse.headers.get("set-cookie");

  if (setCookie) {
    headers.set("set-cookie", setCookie);
  }

  return redirect(safeRedirectTo, { headers });
}

export function loader({ request }: Route.LoaderArgs) {
  const redirectTo = getSafeRedirectTo(request.url);

  return { redirectTo };
}

export default function SignOut({ loaderData }: Route.ComponentProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
      <div className="w-full space-y-6 rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Sign out</h1>
        <p className="text-sm text-gray-600">
          You are about to sign out from the shared session.
        </p>

        <Form method="post">
          <input type="hidden" name="app" value="admin" />
          <input
            type="hidden"
            name="redirectTo"
            value={loaderData.redirectTo}
          />
          <button
            type="submit"
            className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white"
          >
            Sign out
          </button>
        </Form>
      </div>
    </main>
  );
}
