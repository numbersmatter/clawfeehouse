import type { Route } from "./+types/private";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Gallery Private" },
    {
      name: "description",
      content: "Protected gallery page for signed-in users.",
    },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return {
    userEmail: context.session?.user?.email ?? "unknown",
  };
}

export default function PrivatePage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Private Gallery</h1>
      <p className="mt-2 text-gray-600">
        Signed in as {loaderData.userEmail}
      </p>
      <p className="mt-4 text-gray-700">
        This route is intentionally protected by the worker auth guard.
      </p>
    </main>
  );
}
