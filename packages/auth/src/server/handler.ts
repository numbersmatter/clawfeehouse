import type { AuthInstance } from "./auth";

export function isAuthRoute(
  request: Request,
  basePath = "/api/auth",
): boolean {
  return new URL(request.url).pathname.startsWith(basePath);
}

export function handleAuthRequest(
  auth: AuthInstance,
  request: Request,
): Promise<Response> {
  return auth.handler(request);
}
