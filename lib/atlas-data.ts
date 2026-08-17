import {
  Home,
  LayoutDashboard,
  Cpu,
  Brain,
  Settings as SettingsIcon,
  Smartphone,
  KeyRound,
  Wallet,
  Headphones,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { to: string; label: string; icon: LucideIcon };

/** Add a route here and it appears in the navigation bar. */
export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/devices", label: "Devices", icon: Cpu },
  { to: "/memory", label: "Memory", icon: Brain },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];


export type Trackable = { id: string; label: string; icon: LucideIcon };

/**
 * Devices Atlas will eventually be able to link and track.
 * Link state lives in AtlasProvider so real hardware can flip it to `linked`
 * later without touching this list.
 */
export const TRACKABLES: Trackable[] = [
  { id: "phone", label: "Phone", icon: Smartphone },
  { id: "keys", label: "Keys", icon: KeyRound },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "headphones", label: "Headphones", icon: Headphones },
  { id: "controller", label: "Controller", icon: Gamepad2 },
];

export const NOT_LINKED_LOCATION = "Location unavailable — device not linked.";

export type StatusMetric = {
  id: string;
  label: string;
  value: string;
  percent: number;
  tone: "success" | "primary" | "warning" | "destructive" | "muted";
  note?: string;
};

/**
 * Only reflects what is actually knowable right now:
 * the site is open (online), and no robot hardware is connected.
 */
export const STATUS_METRICS: StatusMetric[] = [
  {
    id: "online",
    label: "Online",
    value: "Yes",
    percent: 100,
    tone: "success",
    note: "Control center session is active.",
  },
  {
    id: "battery",
    label: "Battery",
    value: "0%",
    percent: 0,
    tone: "destructive",
    note: "No physical robot connected.",
  },
  {
    id: "wifi",
    label: "Wi-Fi",
    value: "Not Connected to Robot",
    percent: 0,
    tone: "destructive",
    note: "Robot network link unavailable.",
  },
  {
    id: "health",
    label: "System health",
    value: "Waiting for Robot",
    percent: 0,
    tone: "warning",
    note: "Diagnostics start once hardware reports in.",
  },
];

export type LogEntry = { id: string; time: string; text: string };

/** No fabricated history — real events only. */
export const INITIAL_LOG: LogEntry[] = [];
