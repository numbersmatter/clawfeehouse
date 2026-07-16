const AUTH_HOST = "https://auth.clawfeehouse.com";
const ADMIN_ORIGIN = "https://admin.clawfeehouse.com";
const GALLERY_ORIGIN = "https://gallery.clawfeehouse.com";
const COMMISSIONER_ORIGIN = "https://commissioner.clawfeehouse.com";
const LOCAL_AUTH_HOST = "http://localhost:5175";
const LOCAL_ADMIN_ORIGIN = "http://localhost:5173";
const LOCAL_GALLERY_ORIGIN = "http://localhost:5174";
const LOCAL_COMMISSIONER_ORIGIN = "http://localhost:5177";

const ALLOWED_ORIGINS = [
  ADMIN_ORIGIN,
  GALLERY_ORIGIN,
  COMMISSIONER_ORIGIN,
  LOCAL_ADMIN_ORIGIN,
  LOCAL_GALLERY_ORIGIN,
  LOCAL_COMMISSIONER_ORIGIN,
];

function isLocalHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function getDefaultAdminTarget(isLocal: boolean): string {
  return isLocal
    ? `${LOCAL_ADMIN_ORIGIN}/dashboard`
    : `${ADMIN_ORIGIN}/dashboard`;
}

function getDefaultGalleryTarget(isLocal: boolean): string {
  return isLocal
    ? `${LOCAL_GALLERY_ORIGIN}/private`
    : `${GALLERY_ORIGIN}/private`;
}

function getDefaultCommissionerTarget(
  isLocal: boolean,
): string {
  return isLocal
    ? `${LOCAL_COMMISSIONER_ORIGIN}/commissions`
    : `${COMMISSIONER_ORIGIN}/commissions`;
}

function inferDefaultTarget(
  app: string | null,
  isLocal: boolean,
): string {
  if (app === "gallery") {
    return getDefaultGalleryTarget(isLocal);
  }

  if (app === "commissioner") {
    return getDefaultCommissionerTarget(isLocal);
  }

  return getDefaultAdminTarget(isLocal);
}

export function getSafeRedirectTo(
  urlString: string,
): string {
  const url = new URL(urlString);
  const app = url.searchParams.get("app");
  const redirectTo = url.searchParams.get("redirectTo");
  const fallback = inferDefaultTarget(
    app,
    isLocalHost(url.hostname),
  );

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
  requestUrl?: string,
): string {
  const safeApp =
    app === "gallery" || app === "commissioner"
      ? app
      : "admin";
  const params = new URLSearchParams({
    app: safeApp,
    redirectTo,
  });

  let authOrigin = AUTH_HOST;

  if (requestUrl) {
    const request = new URL(requestUrl);

    if (isLocalHost(request.hostname)) {
      authOrigin = LOCAL_AUTH_HOST;
    }
  }

  return `${authOrigin}/callback?${params.toString()}`;
}
