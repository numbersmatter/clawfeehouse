import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import ImageList from "~/components/image-gallery";
import { MainImage } from "~/components/main-image";
import { TagFilter } from "~/components/tag-filter";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
}

const sampleImage = {
  id: "1",
  url: "https://picsum.photos/id/10/1200/800",
  title: "Forest Path",
  author: "Paul Jarvis",
  date: "2023-11-01",
  tags: ["nature", "forest", "green"],
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <>
    <header>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Gallery
        </h1>
      </div>
    </header>
    <main>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TagFilter />
        <MainImage image={sampleImage} />
        <ImageList />
      </div>
    </main>
  </>;
}
