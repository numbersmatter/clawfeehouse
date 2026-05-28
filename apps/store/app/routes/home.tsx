import type { Route } from "./+types/home";
import { Link } from "react-router";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Clawfeehouse Store | Custom Art Commissions" },
    {
      name: "description",
      content:
        "Browse custom art commission tiers and submit your project brief.",
    },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return {
    valueFromCloudflare:
      context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
  };
}

const tiers = [
  {
    name: "Sketch Sprint",
    price: "$85",
    delivery: "3 business days",
    details:
      "Single character concept sketch with two revision passes.",
  },
  {
    name: "Full Color Portrait",
    price: "$240",
    delivery: "7 business days",
    details:
      "High-detail portrait with lighting study and commercial license add-on.",
  },
  {
    name: "Scene Commission",
    price: "$480",
    delivery: "14 business days",
    details:
      "Multi-character environment composition for posters, covers, or campaigns.",
  },
];

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <section className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur md:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="rounded-full bg-orange-200/70 px-3 py-1 text-xs text-black hover:bg-orange-200/70">
            Store micro app
          </Badge>
          <p className="text-xs text-muted-foreground">
            {loaderData.valueFromCloudflare}
          </p>
        </div>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold tracking-tight text-zinc-900 md:text-6xl">
          Custom Art Commissions, crafted for your brand and stories.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-700 md:text-base">
          Pick a commission tier, define your style direction, and get a
          delivery timeline before payment. Built for collectors, creators,
          and indie studios.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/commissions">Start a request</Link>
          </Button>
          <Button asChild variant="outline">
            <a href="#tiers">View commission tiers</a>
          </Button>
        </div>
      </section>

      <section id="tiers" className="mt-8 grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.name} className="border-black/10 bg-white/90">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-zinc-900">
                {tier.name}
              </CardTitle>
              <CardDescription>{tier.details}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Base price:</span> {tier.price}
              </p>
              <p>
                <span className="font-medium">Delivery:</span> {tier.delivery}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
