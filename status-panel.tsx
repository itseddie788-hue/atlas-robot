import { Panel } from "./PageShell";
import { STATUS_METRICS } from "@/lib/atlas-data";

const BAR: Record<string, string> = {
  success: "bg-success",
  primary: "bg-primary",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-muted",
};

const DOT: Record<string, string> = {
  success: "bg-success",
  primary: "bg-primary",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-muted",
};

export function StatusPanel() {
  return (
    <Panel
      title="Robot Status"
      action={
        <span className="flex items-center gap-2 text-xs tracking-widest text-destructive uppercase">
          <span className="h-2 w-2 rounded-full bg-destructive" />
          No Robot Connected
        </span>
      }
    >
      <ul className="space-y-4">
        {STATUS_METRICS.map((m) => (
          <li key={m.id}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className={`h-2 w-2 rounded-full ${DOT[m.tone]}`} />
                {m.label}
              </span>
              <span className="text-right font-semibold">{m.value}</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full ${BAR[m.tone]} transition-all duration-700`}
                style={{ width: `${Math.max(m.percent, m.percent === 0 ? 2 : 0)}%` }}
              />
            </div>
            {m.note ? <p className="mt-1 text-xs text-muted-foreground">{m.note}</p> : null}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
