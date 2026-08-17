import type { ReactNode } from "react";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="font-display text-[0.65rem] tracking-[0.35em] text-primary uppercase">
          Project Atlas
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p> : null}
      </header>
      {children}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="hud-panel p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-sm tracking-[0.2em] uppercase">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
