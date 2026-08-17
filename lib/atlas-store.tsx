import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type FaceState =
  | "idle"
  | "listening"
  | "speaking"
  | "thinking"
  | "offline"
  | "not-connected";

export type LogEntry = { id: string; time: string; text: string };

export type ColorPreset = { id: string; label: string; base: string; glow: string };

/** Semantic color presets (oklch) — no raw hex in components. */
export const ACCENT_PRESETS: ColorPreset[] = [
  { id: "cyan", label: "Cyan", base: "oklch(0.72 0.17 232)", glow: "oklch(0.85 0.14 205)" },
  { id: "violet", label: "Violet", base: "oklch(0.68 0.19 300)", glow: "oklch(0.82 0.15 310)" },
  { id: "emerald", label: "Emerald", base: "oklch(0.74 0.17 160)", glow: "oklch(0.86 0.14 165)" },
  { id: "amber", label: "Amber", base: "oklch(0.79 0.16 78)", glow: "oklch(0.89 0.13 90)" },
  { id: "rose", label: "Rose", base: "oklch(0.68 0.2 15)", glow: "oklch(0.82 0.15 20)" },
];

export const BACKGROUND_PRESETS: ColorPreset[] = [
  { id: "void", label: "Void", base: "oklch(0.16 0.03 258)", glow: "oklch(0.21 0.035 258)" },
  { id: "abyss", label: "Abyss", base: "oklch(0.13 0.02 250)", glow: "oklch(0.18 0.025 250)" },
  { id: "carbon", label: "Carbon", base: "oklch(0.17 0.005 270)", glow: "oklch(0.22 0.008 270)" },
  { id: "nebula", label: "Nebula", base: "oklch(0.17 0.045 300)", glow: "oklch(0.22 0.05 300)" },
  { id: "hangar", label: "Hangar", base: "oklch(0.19 0.03 190)", glow: "oklch(0.24 0.035 190)" },
];

export type BackgroundStyle = "grid" | "plain" | "scanlines" | "stars";
export type FaceStyle = "visor" | "round" | "classic";
export type UiTheme = "hud" | "minimal" | "terminal";

export type AtlasSettings = {
  backgroundStyle: BackgroundStyle;
  backgroundColor: string;
  accentColor: string;
  robotColor: string;
  faceStyle: FaceStyle;
  uiTheme: UiTheme;
  animation: number;
  voiceEnabled: boolean;
  volume: number;
  pitch: number;
};

export const DEFAULT_SETTINGS: AtlasSettings = {
  backgroundStyle: "grid",
  backgroundColor: "void",
  accentColor: "cyan",
  robotColor: "cyan",
  faceStyle: "visor",
  uiTheme: "hud",
  animation: 60,
  voiceEnabled: true,
  volume: 80,
  pitch: 0.8,
};

const STORAGE_KEY = "atlas.settings.v1";

type AtlasContextValue = {
  settings: AtlasSettings;
  updateSettings: (patch: Partial<AtlasSettings>) => void;
  resetSettings: () => void;
  face: FaceState;
  setFace: (state: FaceState) => void;
  /** Device id -> linked. Real hardware can flip these to true later. */
  links: Record<string, boolean>;
  setLinked: (id: string, linked: boolean) => void;
  log: LogEntry[];
  addLog: (text: string) => void;
};

const AtlasContext = createContext<AtlasContextValue | null>(null);

function preset(list: ColorPreset[], id: string) {
  return list.find((p) => p.id === id) ?? list[0]!;
}

export function AtlasProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AtlasSettings>(DEFAULT_SETTINGS);
  const [face, setFace] = useState<FaceState>("idle");
  const [links, setLinks] = useState<Record<string, boolean>>({});
  const [log, setLog] = useState<LogEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const bg = preset(BACKGROUND_PRESETS, settings.backgroundColor);
    const accent = preset(ACCENT_PRESETS, settings.accentColor);
    const robot = preset(ACCENT_PRESETS, settings.robotColor);

    root.style.setProperty("--background", bg.base);
    root.style.setProperty("--card", bg.glow);
    root.style.setProperty("--popover", bg.glow);
    root.style.setProperty("--primary", accent.base);
    root.style.setProperty("--primary-glow", accent.glow);
    root.style.setProperty("--ring", accent.base);
    root.style.setProperty("--atlas-robot", robot.base);
    root.style.setProperty("--atlas-robot-glow", robot.glow);
    root.style.setProperty("--atlas-motion", String(settings.animation / 60));
    root.dataset["atlasBg"] = settings.backgroundStyle;
    root.dataset["atlasTheme"] = settings.uiTheme;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  const updateSettings = useCallback(
    (patch: Partial<AtlasSettings>) => setSettings((s) => ({ ...s, ...patch })),
    [],
  );

  const addLog = useCallback((text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setLog((prev) => [{ id: crypto.randomUUID(), time, text }, ...prev].slice(0, 30));
  }, []);

  const value = useMemo<AtlasContextValue>(
    () => ({
      settings,
      updateSettings,
      resetSettings: () => setSettings(DEFAULT_SETTINGS),
      face,
      setFace,
      links,
      setLinked: (id, linked) => setLinks((p) => ({ ...p, [id]: linked })),
      log,
      addLog,
    }),
    [settings, updateSettings, face, links, log, addLog],
  );

  return <AtlasContext.Provider value={value}>{children}</AtlasContext.Provider>;
}

export function useAtlas() {
  const ctx = useContext(AtlasContext);
  if (!ctx) throw new Error("useAtlas must be used inside AtlasProvider");
  return ctx;
}
