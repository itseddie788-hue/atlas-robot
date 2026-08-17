import { cn } from "@/lib/utils";
import type { FaceState, FaceStyle } from "@/lib/atlas-store";

export type Expression = FaceState;

const MOUTHS: Record<FaceState, string> = {
  idle: "M 26 46 Q 40 52 54 46",
  listening: "M 30 47 Q 40 47 50 47",
  speaking: "M 26 44 Q 40 58 54 44",
  thinking: "M 28 48 Q 40 42 52 50",
  offline: "M 28 50 L 52 50",
  "not-connected": "M 28 50 Q 40 44 52 50",
};

export const FACE_LABELS: Record<FaceState, string> = {
  idle: "Standing by",
  listening: "Listening…",
  speaking: "Speaking",
  thinking: "Processing",
  offline: "Offline",
  "not-connected": "Not connected",
};

export function RobotFace({
  expression = "idle",
  size = 96,
  faceStyle = "visor",
  showLabel = true,
  className,
}: {
  expression?: FaceState;
  size?: number;
  faceStyle?: FaceStyle;
  showLabel?: boolean;
  className?: string;
}) {
  const dim = expression === "offline" || expression === "not-connected";
  const eyeR = expression === "listening" ? 7.5 : expression === "offline" ? 3 : 6;
  const radius = faceStyle === "round" ? 30 : faceStyle === "classic" ? 8 : 18;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "hud-panel relative grid place-items-center overflow-hidden rounded-2xl",
          !dim && "scanline animate-atlas-float",
          expression === "listening" && "animate-atlas-pulse",
        )}
        style={{ width: size, height: size, opacity: dim ? 0.6 : 1 }}
        aria-label={`Atlas assistant: ${FACE_LABELS[expression]}`}
        role="img"
      >
        <svg viewBox="0 0 80 80" width={size * 0.78} height={size * 0.78}>
          <defs>
            <linearGradient id="atlas-eye" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--atlas-robot-glow, var(--primary-glow))" />
              <stop offset="100%" stopColor="var(--atlas-robot, var(--primary))" />
            </linearGradient>
          </defs>
          <rect
            x="8"
            y="10"
            width="64"
            height="60"
            rx={radius}
            fill="color-mix(in oklab, var(--card) 80%, transparent)"
            stroke="var(--atlas-robot, var(--primary))"
            strokeOpacity={dim ? 0.25 : 0.5}
          />
          <g
            className={dim ? undefined : "animate-atlas-blink"}
            style={{ transformOrigin: "40px 32px" }}
          >
            <circle cx="28" cy="32" r={eyeR} fill="url(#atlas-eye)" />
            <circle cx="52" cy="32" r={eyeR} fill="url(#atlas-eye)" />
          </g>
          <path
            d={MOUTHS[expression]}
            fill="none"
            stroke="var(--atlas-robot-glow, var(--primary-glow))"
            strokeWidth="3"
            strokeLinecap="round"
            className={expression === "speaking" ? "animate-atlas-pulse" : undefined}
          />
          {faceStyle !== "round" ? (
            <>
              <line
                x1="40"
                y1="10"
                x2="40"
                y2="3"
                stroke="var(--atlas-robot, var(--primary))"
                strokeWidth="2"
              />
              <circle cx="40" cy="3" r="3" fill="var(--atlas-robot-glow, var(--primary-glow))" />
            </>
          ) : null}
        </svg>
      </div>
      {showLabel ? (
        <div className="hidden sm:block">
          <p className="font-display text-xs tracking-widest text-muted-foreground uppercase">
            Atlas Unit
          </p>
          <p className="neon-text text-sm font-semibold">{FACE_LABELS[expression]}</p>
        </div>
      ) : null}
    </div>
  );
}
