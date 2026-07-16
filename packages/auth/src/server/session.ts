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

export function isArtistSession(
  session: Awaited<ReturnType<typeof getSession>>,
): boolean {
  const role =
    (session as { user?: { role?: string } } | null)?.user
      ?.role ?? "";

  return role === "artist" || role === "admin";
}

export function isCommissionerSession(
  session: Awaited<ReturnType<typeof getSession>>,
): boolean {
  const role =
    (session as { user?: { role?: string } } | null)?.user
      ?.role ?? "";

  return (
    role === "commissioner" ||
    role === "user" ||
    role === "admin"
  );
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

export async function requireArtistSession(
  auth: AuthInstance,
  request: Request,
) {
  const session = await getSession(auth, request);

  if (!session || !isArtistSession(session)) {
    return null;
  }

  return session;
}

export async function requireCommissionerSession(
  auth: AuthInstance,
  request: Request,
) {
  const session = await getSession(auth, request);

  if (!session || !isCommissionerSession(session)) {
    return null;
  }

  return session;
}
