import type { AuthInstance } from "./auth";

export type AuthSession = Awaited<
  ReturnType<AuthInstance["api"]["getSession"]>
>;

export async function getSession(
  auth: AuthInstance,
  request: Request,
) {
  return auth.api.getSession({ headers: request.headers });
}

export function isAdminSession(
  session: Awaited<ReturnType<typeof getSession>>,
): boolean {
  const role =
    (session as { user?: { role?: string } } | null)?.user
      ?.role ?? "";

  return role === "admin";
}

export async function requireAdminSession(
  auth: AuthInstance,
  request: Request,
) {
  const session = await getSession(auth, request);

  if (!session || !isAdminSession(session)) {
    return null;
  }

  return session;
}
