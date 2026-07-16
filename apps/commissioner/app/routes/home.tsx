import { Link } from "react-router";

import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Commission Tracker" },
    {
      name: "description",
      content:
        "Track your Clawfeehouse commission progress, files, and messages.",
    },
  ];
}

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          Clawfeehouse
        </p>
        <h1 className="text-4xl font-semibold text-gray-900">
          Commissioner Portal
        </h1>
        <p className="max-w-xl text-base text-gray-600">
          Sign in to review status updates, message your artist,
          and download delivered files for your active commissions.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/commissions"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          View My Commissions
        </Link>
        <a
          href="https://store.clawfeehouse.com/commissions"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800"
        >
          Submit New Request
        </a>
      </div>
    </main>
  );
}
