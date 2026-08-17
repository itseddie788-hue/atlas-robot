import { Link } from "@tanstack/react-router";
import { NAV_ITEMS } from "@/lib/atlas-data";

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-primary/50 text-primary shadow-[var(--shadow-neon)]">
            <span className="font-display text-xs">A</span>
          </span>
          <span className="font-display text-sm tracking-[0.3em] uppercase">Atlas</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
              activeProps={{
                className:
                  "bg-secondary text-primary-glow shadow-[var(--shadow-neon)] border border-primary/40",
              }}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
