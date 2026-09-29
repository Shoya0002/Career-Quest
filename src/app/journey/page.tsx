import type { Metadata } from "next";
import Link from "next/link";
import { Milestone, ArrowLeft, Layers } from "lucide-react";
import { Navbar, Footer } from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Career Journey & Decision Matrix | CareerQuest",
  description: "Visualize career roadmaps, education nodes, and multi-dimensional decision matrices.",
};

export default function JourneyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-primary dark:bg-indigo-950/50">
              <Milestone className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Career Journey &amp; Decision Matrix
              </h1>
              <p className="text-xs text-muted-foreground">
                Interactive React Flow roadmap and multi-criteria comparison matrix.
              </p>
            </div>
          </div>

          <Link
            href={ROUTES.HOME}
            className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}
          >
            <ArrowLeft className="size-4" />
            <span>Back</span>
          </Link>
        </div>

        {/* Foundation Placeholder State */}
        <div className="flex flex-1 items-center justify-center py-12">
          <Card className="max-w-md w-full border-dashed border-2 text-center p-6 bg-card/60">
            <CardHeader className="pb-3">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-indigo-50 text-primary dark:bg-indigo-950/50">
                <Layers className="size-6" />
              </div>
              <Badge variant="secondary" className="mx-auto w-fit text-xs font-semibold">
                Route Initialized: /journey
              </Badge>
              <CardTitle className="text-lg font-semibold mt-2">
                Journey &amp; Decision Matrix Ready
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                React Flow node/edge definitions, mock pathways, and Recharts decision matrix contracts are in place. Ready for Google Stitch UI screens.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 flex flex-col gap-2">
              <Link
                href={ROUTES.DASHBOARD}
                className={buttonVariants({ size: "sm" })}
              >
                Return to Dashboard
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
