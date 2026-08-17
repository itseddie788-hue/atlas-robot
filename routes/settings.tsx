import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw, Volume2, Play, Square } from "lucide-react";
import { PageShell, Panel } from "@/components/atlas/PageShell";
import { RobotFace } from "@/components/atlas/RobotFace";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  ACCENT_PRESETS,
  BACKGROUND_PRESETS,
  useAtlas,
  type BackgroundStyle,
  type FaceStyle,
  type UiTheme,
} from "@/lib/atlas-store";
import { useAtlasVoice } from "@/lib/use-atlas-voice";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ATLAS" },
      {
        name: "description",
        content:
          "Customize the ATLAS interface: background, accent colors, robot appearance, animation and voice.",
      },
      { property: "og:title", content: "Settings — ATLAS" },
      {
        property: "og:description",
        content: "Customize background, colors, robot face, animation intensity and voice output.",
      },
    ],
  }),
  component: Settings,
});

const BG_STYLES: { id: BackgroundStyle; label: string }[] = [
  { id: "grid", label: "Grid" },
  { id: "plain", label: "Plain" },
  { id: "scanlines", label: "Scanlines" },
  { id: "stars", label: "Stars" },
];

const FACE_STYLES: { id: FaceStyle; label: string }[] = [
  { id: "visor", label: "Visor" },
  { id: "round", label: "Round" },
  { id: "classic", label: "Classic" },
];

const THEMES: { id: UiTheme; label: string }[] = [
  { id: "hud", label: "HUD" },
  { id: "minimal", label: "Minimal" },
  { id: "terminal", label: "Terminal" },
];

function Chips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-full border px-3 py-1 text-xs tracking-widest uppercase transition-all ${
            value === o.id
              ? "border-primary/70 bg-secondary text-primary-glow shadow-[var(--shadow-neon)]"
              : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Swatches({
  presets,
  value,
  onChange,
}: {
  presets: { id: string; label: string; base: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {presets.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          title={p.label}
          aria-label={p.label}
          aria-pressed={value === p.id}
          className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${
            value === p.id ? "border-primary shadow-[var(--shadow-neon)]" : "border-border"
          }`}
          style={{ background: p.base }}
        />
      ))}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="font-display text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function Settings() {
  const { settings, updateSettings, resetSettings } = useAtlas();
  const { supported, speaking, speak, stop } = useAtlasVoice({
    volume: settings.volume / 100,
    pitch: settings.pitch,
  });

  return (
    <PageShell
      title="Settings"
      subtitle="Customize the ATLAS control center. Changes apply instantly and are saved on this device."
    >
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <Panel
            title="Customize"
            action={
              <Button variant="ghost" size="sm" onClick={resetSettings}>
                <RotateCcw className="mr-1 h-3.5 w-3.5" />
                Reset
              </Button>
            }
          >
            <div className="space-y-6">
              <Row label="Background style">
                <Chips
                  options={BG_STYLES}
                  value={settings.backgroundStyle}
                  onChange={(v) => updateSettings({ backgroundStyle: v })}
                />
              </Row>
              <Row label="Background color">
                <Swatches
                  presets={BACKGROUND_PRESETS}
                  value={settings.backgroundColor}
                  onChange={(v) => updateSettings({ backgroundColor: v })}
                />
              </Row>
              <Row label="Accent color">
                <Swatches
                  presets={ACCENT_PRESETS}
                  value={settings.accentColor}
                  onChange={(v) => updateSettings({ accentColor: v })}
                />
              </Row>
              <Row label="ATLAS robot color">
                <Swatches
                  presets={ACCENT_PRESETS}
                  value={settings.robotColor}
                  onChange={(v) => updateSettings({ robotColor: v })}
                />
              </Row>
              <Row label="Robot face">
                <Chips
                  options={FACE_STYLES}
                  value={settings.faceStyle}
                  onChange={(v) => updateSettings({ faceStyle: v })}
                />
              </Row>
              <Row label="UI theme">
                <Chips
                  options={THEMES}
                  value={settings.uiTheme}
                  onChange={(v) => updateSettings({ uiTheme: v })}
                />
              </Row>
              <Row label={`Animation intensity — ${settings.animation}%`}>
                <Slider
                  value={[settings.animation]}
                  onValueChange={([v]) => updateSettings({ animation: v ?? 0 })}
                  max={100}
                  step={5}
                />
              </Row>
            </div>
          </Panel>

          <Panel title="Sound & Voice">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">ATLAS voice output</p>
                  <p className="text-xs text-muted-foreground">
                    Prototype male voice. ATLAS cannot understand commands yet.
                  </p>
                </div>
                <Switch
                  checked={settings.voiceEnabled}
                  onCheckedChange={(v) => updateSettings({ voiceEnabled: v })}
                />
              </div>
              <Row label={`Volume — ${settings.volume}%`}>
                <Slider
                  value={[settings.volume]}
                  onValueChange={([v]) => updateSettings({ volume: v ?? 0 })}
                  max={100}
                  step={1}
                />
              </Row>
              <Row label={`Voice depth — ${settings.pitch.toFixed(2)}`}>
                <Slider
                  value={[settings.pitch * 100]}
                  onValueChange={([v]) => updateSettings({ pitch: (v ?? 80) / 100 })}
                  min={50}
                  max={120}
                  step={5}
                />
              </Row>
              <Button
                variant="outline"
                size="sm"
                disabled={!supported || !settings.voiceEnabled}
                onClick={() =>
                  speaking ? stop() : speak("Atlas is standing by. This is a voice preview.")
                }
              >
                {speaking ? (
                  <Square className="mr-2 h-3.5 w-3.5" />
                ) : (
                  <Play className="mr-2 h-3.5 w-3.5" />
                )}
                {speaking ? "Stop preview" : "Test voice"}
              </Button>
              {!supported ? (
                <p className="flex items-center gap-2 text-xs text-warning">
                  <Volume2 className="h-3.5 w-3.5" />
                  Speech output isn&apos;t supported in this browser.
                </p>
              ) : null}
            </div>
          </Panel>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Panel title="Live Preview">
            <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-secondary/30 p-6">
              <RobotFace
                expression={speaking ? "speaking" : "idle"}
                size={110}
                faceStyle={settings.faceStyle}
                showLabel={false}
              />
              <p className="font-display text-sm tracking-[0.3em] uppercase">ATLAS</p>
              <div className="grid w-full grid-cols-3 gap-2">
                <span className="rounded-lg bg-primary/20 py-2 text-center text-xs text-primary-glow">
                  Accent
                </span>
                <span className="rounded-lg bg-secondary py-2 text-center text-xs">Surface</span>
                <span className="rounded-lg bg-destructive/20 py-2 text-center text-xs text-destructive">
                  Alert
                </span>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Preview reflects background, accent, robot color, face and animation settings.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}
