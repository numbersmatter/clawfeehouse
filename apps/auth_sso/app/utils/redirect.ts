const AUTH_HOST = "https://auth.clawfeehouse.com";
const ADMIN_ORIGIN = "https://admin.clawfeehouse.com";
const GALLERY_ORIGIN = "https://gallery.clawfeehouse.com";

const ALLOWED_ORIGINS = [ADMIN_ORIGIN, GALLERY_ORIGIN];
const DEFAULT_ADMIN_TARGET = `${ADMIN_ORIGIN}/dashboard`;
const DEFAULT_GALLERY_TARGET = `${GALLERY_ORIGIN}/private`;

function inferDefaultTarget(app?: string | null): string {
  if (app === "gallery") {
    return DEFAULT_GALLERY_TARGET;
  }

  return DEFAULT_ADMIN_TARGET;
}

export function getSafeRedirectTo(
  urlString: string,
): string {
  const url = new URL(urlString);
  const app = url.searchParams.get("app");
  const redirectTo = url.searchParams.get("redirectTo");
  const fallback = inferDefaultTarget(app);

  if (!redirectTo) {
    return fallback;
  }

  try {
    const parsed = new URL(redirectTo);

    if (!ALLOWED_ORIGINS.includes(parsed.origin)) {
      return fallback;
    }

    return parsed.toString();
  } catch {
    return fallback;
  }
}

export function getSignInPath(urlString: string): string {
  const url = new URL(urlString);
  const app = url.searchParams.get("app") ?? "admin";
  const redirectTo = encodeURIComponent(
    getSafeRedirectTo(urlString),
  );

  return `/sign-in?app=${encodeURIComponent(app)}&redirectTo=${redirectTo}`;
}

export function getSignUpPath(urlString: string): string {
  const url = new URL(urlString);
  const app = url.searchParams.get("app") ?? "admin";
  const redirectTo = encodeURIComponent(
    getSafeRedirectTo(urlString),
  );

  return `/sign-up?app=${encodeURIComponent(app)}&redirectTo=${redirectTo}`;
}

export function getAuthCallbackUrl(
  app: string | null,
  redirectTo: string,
): string {
  const safeApp = app === "gallery" ? "gallery" : "admin";
  const params = new URLSearchParams({
    app: safeApp,
    redirectTo,
  });

  return `${AUTH_HOST}/callback?${params.toString()}`;
}
