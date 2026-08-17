import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Panel } from "@/components/atlas/PageShell";
import { ComingSoonDialog } from "@/components/atlas/ComingSoonDialog";
import { Button } from "@/components/ui/button";
import { TRACKABLES, type Trackable } from "@/lib/atlas-data";
import { useAtlas } from "@/lib/atlas-store";

export const Route = createFileRoute("/devices")({
  head: () => ({
    meta: [
      { title: "Devices — ATLAS" },
      {
        name: "description",
        content:
          "Devices ATLAS will be able to link and track. Linking is coming in a future update.",
      },
      { property: "og:title", content: "Devices — ATLAS" },
      {
        property: "og:description",
        content: "Devices ATLAS will be able to link and track — linking coming soon.",
      },
    ],
  }),
  component: Devices,
});

function Devices() {
  const { links } = useAtlas();
  const [pending, setPending] = useState<Trackable | null>(null);

  return (
    <PageShell
      title="Devices"
      subtitle="Devices ATLAS will be able to link and track. None are linked yet."
    >
      <Panel
        title="Trackable Devices"
        action={
          <span className="text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
            Linking Coming Soon
          </span>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {TRACKABLES.map((item) => {
            const linked = !!links[item.id];
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3"
              >
                <item.icon className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span
                      className={`h-2 w-2 rounded-full ${linked ? "bg-success" : "bg-destructive"}`}
                    />
                    {linked ? "Linked" : "Not Linked"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPending(item)}
                  disabled={linked}
                >
                  {linked ? "Linked" : "Link"}
                </Button>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="mt-5">
        <Panel title="Expansion Slots">
          <p className="text-sm text-muted-foreground">
            Cameras, arm modules and room sensors will appear here once ATLAS hardware exists.
            Nothing is connected today.
          </p>
        </Panel>
      </div>

      <ComingSoonDialog
        open={!!pending}
        onOpenChange={(open) => !open && setPending(null)}
        title="Device Linking Coming Soon"
        description={`ATLAS will be able to link and track your ${pending?.label.toLowerCase() ?? "device"} in a future update. Its status stays Not Linked for now.`}
      />
    </PageShell>
  );
}
