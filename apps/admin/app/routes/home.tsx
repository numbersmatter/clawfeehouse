import type { Route } from "./+types/home";
import { redirect } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Admin" },
    { name: "description", content: "Admin app." },
  ];
}

export function loader({ }: Route.LoaderArgs) {
  return redirect("/dashboard");
}

export default function Home() {
  return null;
}
