import { Inbox } from "lucide-react";
import type { LogEntry } from "@/lib/atlas-store";

export function ActivityLog({ entries }: { entries: LogEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-4 py-10 text-center">
        <Inbox className="h-6 w-6 text-muted-foreground" />
        <p className="font-display text-sm tracking-wide">No activity yet.</p>
        <p className="max-w-sm text-xs text-muted-foreground">
          Activity will appear here once ATLAS is connected to real devices.
        </p>
      </div>
    );
  }

  return (
    <ol className="space-y-3">
      {entries.map((e) => (
        <li key={e.id} className="flex gap-3 border-l border-primary/40 pl-4 text-sm">
          <span className="w-12 shrink-0 font-mono text-xs text-primary">{e.time}</span>
          <span className="text-muted-foreground">{e.text}</span>
        </li>
      ))}
    </ol>
  );
}
