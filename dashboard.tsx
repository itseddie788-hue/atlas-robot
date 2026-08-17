import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Panel } from "@/components/atlas/PageShell";
import { StatusPanel } from "@/components/atlas/StatusPanel";
import { ActivityLog } from "@/components/atlas/ActivityLog";
import { useAtlas } from "@/lib/atlas-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ATLAS" },
      {
        name: "description",
        content:
          "Honest ATLAS status: session online, no robot connected, battery and Wi-Fi unavailable.",
      },
      { property: "og:title", content: "Dashboard — ATLAS" },
      {
        property: "og:description",
        content: "Session online, no robot connected — no simulated telemetry.",
      },
    ],
  }),
  component: Dashboard,
});

const TASKS = [
  "Patrol routines",
  "Charging schedule",
  "Object indexing",
] as const;

function Dashboard() {
  const { log } = useAtlas();

  return (
    <PageShell
      title="Dashboard"
      subtitle="Real state only — the control center is open, but no robot hardware is connected."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <StatusPanel />
        <Panel
          title="Task Queue"
          action={
            <span className="text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
              Coming Soon
            </span>
          }
        >
          <ul className="space-y-3">
            {TASKS.map((t) => (
              <li
                key={t}
                className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm"
              >
                <span>{t}</span>
                <span className="text-xs tracking-widest text-muted-foreground uppercase">
                  Coming Soon
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Tasks become available once a robot is connected.
          </p>
        </Panel>
        <div className="lg:col-span-2">
          <Panel title="Recent Activity">
            <ActivityLog entries={log} />
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}
