import { createFileRoute } from "@tanstack/react-router";
import { Brain, MapPinOff } from "lucide-react";
import { PageShell, Panel } from "@/components/atlas/PageShell";

export const Route = createFileRoute("/memory")({
  head: () => ({
    meta: [
      { title: "Memory — ATLAS" },
      {
        name: "description",
        content: "ATLAS memory is empty — locations and routines require connected devices.",
      },
      { property: "og:title", content: "Memory — ATLAS" },
      {
        property: "og:description",
        content: "ATLAS memory is empty until real devices and sensors are connected.",
      },
    ],
  }),
  component: Memory,
});

function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Brain;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-4 py-10 text-center">
      <Icon className="h-6 w-6 text-muted-foreground" />
      <p className="font-display text-sm tracking-wide">{title}</p>
      <p className="max-w-sm text-xs text-muted-foreground">{body}</p>
    </div>
  );
}

function Memory() {
  return (
    <PageShell title="Memory" subtitle="ATLAS has not learned anything yet.">
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Known Places">
          <EmptyState
            icon={MapPinOff}
            title="No locations remembered yet."
            body="Memory will become available when ATLAS is connected to real devices and sensors."
          />
        </Panel>
        <Panel title="Routines">
          <EmptyState
            icon={Brain}
            title="No routines learned yet."
            body="Routines will appear here once ATLAS can observe real activity."
          />
        </Panel>
      </div>
    </PageShell>
  );
}
