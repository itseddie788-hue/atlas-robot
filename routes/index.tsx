import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mic, MicOff, Activity, Radar } from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/atlas/PageShell";
import { RobotFace, FACE_LABELS } from "@/components/atlas/RobotFace";
import { StatusPanel } from "@/components/atlas/StatusPanel";
import { FindMyStuff } from "@/components/atlas/FindMyStuff";
import { ActivityLog } from "@/components/atlas/ActivityLog";
import { useAtlas } from "@/lib/atlas-store";
import { useAtlasVoice } from "@/lib/use-atlas-voice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATLAS — Robot Control Center Prototype" },
      {
        name: "description",
        content:
          "ATLAS control center prototype: voice preview, honest robot status and device tracking marked coming soon.",
      },
      { property: "og:title", content: "ATLAS — Robot Control Center Prototype" },
      {
        property: "og:description",
        content: "Voice preview, robot status and device tracking — clearly marked coming soon.",
      },
    ],
  }),
  component: Home,
});

const GREETING = "Atlas is standing by. Voice commands are not available yet.";

function Home() {
  const { face, setFace, settings, log, addLog } = useAtlas();
  const [active, setActive] = useState(false);
  const { supported, speaking, speak, stop } = useAtlasVoice({
    volume: settings.volume / 100,
    pitch: settings.pitch,
  });

  useEffect(() => {
    if (active && !speaking) {
      setFace("listening");
    }
  }, [active, speaking, setFace]);

  useEffect(() => {
    if (speaking) setFace("speaking");
  }, [speaking, setFace]);

  useEffect(() => () => stop(), [stop]);

  const toggleVoice = () => {
    if (active) {
      stop();
      setActive(false);
      setFace("idle");
      addLog("Voice preview stopped.");
      return;
    }

    setActive(true);
    setFace("listening");
    addLog("Voice preview started — ATLAS cannot execute commands yet.");
    toast("Voice Commands Coming Soon", {
      description: "ATLAS can respond with a demo voice, but cannot understand commands yet.",
    });

    if (settings.voiceEnabled && supported) {
      window.setTimeout(() => speak(GREETING), 400);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4 pt-8">
        <RobotFace expression={face} size={96} faceStyle={settings.faceStyle} />
        <div className="hud-panel flex items-center gap-2 px-4 py-2 text-xs tracking-[0.2em] uppercase">
          <Radar className="h-4 w-4 text-destructive" />
          Prototype — no robot connected
        </div>
      </div>

      <section className="mt-10 flex flex-col items-center text-center">
        <p className="font-display text-[0.65rem] tracking-[0.35em] text-primary uppercase">
          ATLAS
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Control center for <span className="neon-text">ATLAS</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          A prototype interface. Nothing is linked or tracked yet — every feature that needs real
          hardware is clearly marked Coming Soon.
        </p>

        <div className="relative mt-10 grid place-items-center">
          <span
            className={`absolute h-44 w-44 rounded-full border border-primary/20 ${
              active ? "animate-atlas-pulse" : ""
            }`}
          />
          <button
            onClick={toggleVoice}
            aria-pressed={active}
            className={`relative grid h-32 w-32 place-items-center rounded-full border border-primary/50 bg-card/60 text-primary-glow transition-all duration-300 hover:scale-105 ${
              active
                ? "animate-atlas-pulse shadow-[var(--shadow-neon-strong)]"
                : "shadow-[var(--shadow-neon)]"
            }`}
          >
            {active ? <MicOff className="h-11 w-11" /> : <Mic className="h-11 w-11" />}
            <span className="sr-only">Toggle voice preview</span>
          </button>
        </div>

        <p className="mt-5 font-display text-sm tracking-[0.25em] uppercase">
          {active ? (speaking ? "Speaking…" : "Listening…") : "Tap to Speak"}
        </p>
        <p className="mt-2 text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Voice Commands Coming Soon · Atlas state: {FACE_LABELS[face]}
        </p>
        {!supported ? (
          <p className="mt-2 text-xs text-warning">
            Voice playback isn&apos;t supported in this browser.
          </p>
        ) : null}
      </section>

      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        <StatusPanel />
        <FindMyStuff />
      </div>

      <div className="mt-5">
        <Panel title="Activity Log" action={<Activity className="h-4 w-4 text-primary" />}>
          <ActivityLog entries={log} />
        </Panel>
      </div>
    </main>
  );
}
