import type { Route } from "./+types/home";
import { redirect } from "react-router";

import {
  getSafeRedirectTo,
  getSignInPath,
} from "~/utils/redirect";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Clawfeehouse Auth" },
    {
      name: "description",
      content:
        "Centralized sign-in for admin and gallery apps.",
    },
  ];
}

export function loader({ request, context }: Route.LoaderArgs) {
  const redirectTo = getSafeRedirectTo(request.url);

  if (context.session) {
    return redirect(redirectTo);
  }

  return redirect(getSignInPath(request.url));
}

export default function Home() {
  return null;
}
