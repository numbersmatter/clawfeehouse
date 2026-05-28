import type { Route } from "./+types/commissions";
import { Form, data } from "react-router";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Commission Request | Clawfeehouse Store" },
    {
      name: "description",
      content: "Submit your custom art commission details.",
    },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const tier = String(formData.get("tier") ?? "").trim();
  const brief = String(formData.get("brief") ?? "").trim();

  if (!name || !email || !tier || !brief) {
    return data(
      {
        ok: false,
        message:
          "Please fill out every field so we can estimate the scope correctly.",
      },
      { status: 400 },
    );
  }

  return data({
    ok: true,
    message:
      "Request received. We will reply with availability and next steps within 1 business day.",
    summary: { name, email, tier },
  });
}

export default function Commissions({ actionData }: Route.ComponentProps) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <Card className="border-black/10 bg-white/90">
        <CardHeader>
          <CardTitle className="font-serif text-3xl text-zinc-900">
            Start Your Commission
          </CardTitle>
          <CardDescription>
            Share your project context, visual references, and intended usage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" autoComplete="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier">Commission Tier</Label>
              <Input
                id="tier"
                name="tier"
                placeholder="Sketch Sprint, Full Color Portrait, Scene Commission"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brief">Project Brief</Label>
              <Textarea
                id="brief"
                name="brief"
                placeholder="Describe the subject, style, references, dimensions, and delivery date..."
                rows={6}
                required
              />
            </div>

            <Button type="submit" className="w-full md:w-auto">
              Submit Request
            </Button>
          </Form>

          {actionData ? (
            <p
              className={
                actionData.ok
                  ? "mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"
                  : "mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              }
            >
              {actionData.message}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
