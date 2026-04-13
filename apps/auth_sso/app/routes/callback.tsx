import { redirect } from "react-router";
import type { Route } from "./+types/callback";

import { getSafeRedirectTo, getSignInPath } from "~/utils/redirect";

export function loader({ request, context }: Route.LoaderArgs) {
  const redirectTo = getSafeRedirectTo(request.url);

  if (!context.session) {
    return redirect(getSignInPath(request.url));
  }

  return redirect(redirectTo);
}

export default function CallbackRoute() {
  return null;
}
