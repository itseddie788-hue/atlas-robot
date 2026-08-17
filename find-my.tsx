import { useState } from "react";
import { Panel } from "./PageShell";
import { ComingSoonDialog } from "./ComingSoonDialog";
import { TRACKABLES, NOT_LINKED_LOCATION, type Trackable } from "@/lib/atlas-data";
import { useAtlas } from "@/lib/atlas-store";

export function FindMyStuff({ onSelect }: { onSelect?: (item: Trackable) => void }) {
  const { links } = useAtlas();
  const [selected, setSelected] = useState<Trackable | null>(null);

  return (
    <Panel
      title="Find My Stuff"
      action={
        <span className="text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
          Tracking Coming Soon
        </span>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {TRACKABLES.map((item) => {
          const linked = !!links[item.id];
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelected(item);
                onSelect?.(item);
              }}
              className="group flex flex-col items-start gap-2 rounded-xl border border-border bg-secondary/40 p-4 text-left transition-all hover:border-primary/60 hover:bg-secondary hover:shadow-[var(--shadow-neon)]"
            >
              <div className="flex w-full items-center justify-between">
                <item.icon className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                <span
                  className={`h-2 w-2 rounded-full ${linked ? "bg-success" : "bg-destructive"}`}
                />
              </div>
              <span className="text-sm font-semibold">{item.label}</span>
              <span className="text-[0.7rem] leading-tight text-muted-foreground">
                {linked ? "Linked" : NOT_LINKED_LOCATION}
              </span>
            </button>
          );
        })}
      </div>

      <ComingSoonDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        title={`Tracking ${selected?.label ?? "device"} — Coming Soon`}
        description="This device is not linked, so no location is available. ATLAS will be able to locate linked devices in a future update."
      />
    </Panel>
  );
}
