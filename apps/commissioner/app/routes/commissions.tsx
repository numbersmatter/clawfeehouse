import { Link, redirect } from "react-router";
import { sessionContext } from "../router-context";

import type { Route } from "./+types/commissions";

interface CommissionSummary {
  id: string;
  title: string;
  status: "pending" | "accepted" | "in_progress" | "delivered";
  updatedAt: string;
}

const demoCommissions: CommissionSummary[] = [
  {
    id: "cm_1001",
    title: "Celestial Portrait",
    status: "in_progress",
    updatedAt: "2026-07-15",
  },
  {
    id: "cm_1002",
    title: "Album Cover Sketch",
    status: "pending",
    updatedAt: "2026-07-13",
  },
];

function statusLabel(status: CommissionSummary["status"]): string {
  switch (status) {
    case "pending":
      return "Pending Review";
    case "accepted":
      return "Accepted";
    case "in_progress":
      return "In Progress";
    case "delivered":
      return "Delivered";
    default:
      return status;
  }
}

export function loader({ request, context }: Route.LoaderArgs) {
  const sessionUser = context.get(sessionContext)?.user;

  if (!sessionUser?.id) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("app", "commissioner");
    signInUrl.searchParams.set(
      "redirectTo",
      new URL("/commissions", request.url).toString(),
    );

    return redirect(signInUrl.pathname + signInUrl.search);
  }

  return {
    userEmail: sessionUser.email ?? "commissioner",
    commissions: demoCommissions,
  };
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "My Commissions" }];
}

export default function Commissions({ loaderData }: Route.ComponentProps) {
  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-8 px-6 py-12">
      <header className="space-y-2">
        <p className="text-sm text-gray-500">Signed in as {loaderData.userEmail}</p>
        <h1 className="text-3xl font-semibold text-gray-900">My Commissions</h1>
        <p className="text-gray-600">
          This timeline view is now connected to SSO. Next, we will replace demo rows with
          shared DB-backed commission data.
        </p>
      </header>

      <section className="space-y-3">
        {loaderData.commissions.map((commission) => (
          <article
            key={commission.id}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">{commission.title}</h2>
                <p className="text-sm text-gray-500">Order #{commission.id}</p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {statusLabel(commission.status)}
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-500">Last update: {commission.updatedAt}</p>
          </article>
        ))}
      </section>

      <div className="flex gap-3">
        <a
          href="https://store.clawfeehouse.com/commissions"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Create New Request
        </a>
        <Link
          to="/"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800"
        >
          Back to Portal Home
        </Link>
      </div>
    </main>
  );
}
