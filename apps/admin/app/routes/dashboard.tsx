import type { Route } from "./+types/dashboard";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard" },
    { name: "description", content: "Authenticated admin area." },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return {
    userEmail: context.session?.user?.email ?? "unknown",
  };
}

export default function Dashboard({
  loaderData,
}: Route.ComponentProps) {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Signed in as {loaderData.userEmail}
      </p>
    </main>
  );
}
