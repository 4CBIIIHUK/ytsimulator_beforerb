import React from "react";
import * as I from "@/components/svg/icons";

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export const Card: React.FC<{ className?: string; children: React.ReactNode; glow?: "red" | "emerald" | "amber" | "violet" | "none" }> = ({
  className,
  children,
  glow = "none",
}) => (
  <div
    className={cn(
      "relative rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.045] to-white/[0.015] backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
      glow === "red" && "ring-1 ring-red-500/30 shadow-red-950/40",
      glow === "emerald" && "ring-1 ring-emerald-500/30 shadow-emerald-950/40",
      glow === "amber" && "ring-1 ring-amber-500/30",
      glow === "violet" && "ring-1 ring-violet-500/30",
      className
    )}
  >
    {children}
  </div>
);

export const PageHeader: React.FC<{ icon: React.ReactNode; kicker: string; title: string; desc?: React.ReactNode; right?: React.ReactNode; accent?: string }> = ({
  icon,
  kicker,
  title,
  desc,
  right,
  accent = "from-red-500/20",
}) => (
  <div className={cn("relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br to-transparent p-5 md:p-7", accent)}>
    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
    <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-300">
          {icon}
          {kicker}
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">{title}</h1>
        {desc && <p className="mt-1 max-w-2xl text-sm text-slate-400">{desc}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  </div>
);

type BtnVariant = "primary" | "ghost" | "success" | "warning" | "danger" | "outline";
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: "sm" | "md" | "lg" }> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => (
  <button
    {...props}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
      size === "sm" && "px-3 py-1.5 text-xs",
      size === "md" && "px-4 py-2.5 text-sm",
      size === "lg" && "px-6 py-3.5 text-sm uppercase tracking-wider",
      variant === "primary" && "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-lg shadow-red-900/40 hover:from-red-400 hover:to-red-500",
      variant === "success" && "bg-gradient-to-b from-emerald-400 to-emerald-500 text-slate-950 shadow-lg shadow-emerald-900/30 hover:from-emerald-300",
      variant === "warning" && "bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-900/30 hover:from-amber-300",
      variant === "danger" && "border border-red-500/30 bg-red-950/40 text-red-300 hover:bg-red-900/40",
      variant === "ghost" && "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
      variant === "outline" && "border border-white/15 text-slate-200 hover:border-white/30 hover:bg-white/5",
      className
    )}
  >
    {children}
  </button>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: "red" | "emerald" | "amber" | "violet" | "slate" | "sky"; className?: string }> = ({
  children,
  color = "slate",
  className,
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
      color === "red" && "border-red-500/30 bg-red-500/15 text-red-300",
      color === "emerald" && "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
      color === "amber" && "border-amber-500/30 bg-amber-500/15 text-amber-300",
      color === "violet" && "border-violet-500/30 bg-violet-500/15 text-violet-300",
      color === "sky" && "border-sky-500/30 bg-sky-500/15 text-sky-300",
      color === "slate" && "border-white/10 bg-white/5 text-slate-300",
      className
    )}
  >
    {children}
  </span>
);

export const Progress: React.FC<{ value: number; color?: string; className?: string }> = ({ value, color = "from-red-500 to-rose-400", className }) => (
  <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]", className)}>
    <div className={cn("h-full rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out", color)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);

export const Stat: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: "red" | "sky" | "emerald" | "amber" | "violet" }> = ({
  icon,
  label,
  value,
  sub,
  tone = "red",
}) => (
  <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/20 p-3">
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
        tone === "red" && "bg-red-500/15 text-red-400",
        tone === "sky" && "bg-sky-500/15 text-sky-400",
        tone === "emerald" && "bg-emerald-500/15 text-emerald-400",
        tone === "amber" && "bg-amber-500/15 text-amber-400",
        tone === "violet" && "bg-violet-500/15 text-violet-400"
      )}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="truncate text-base font-black text-white tabular-nums">{value}</div>
      {sub && <div className="truncate text-[10px] text-slate-500">{sub}</div>}
    </div>
  </div>
);

export function GameIcon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  const map: Record<string, React.FC<I.SvgIconProps>> = {
    webcam: I.IconWebcam,
    mic: I.IconMic,
    lighting: I.IconLighting,
    pc: I.IconPC,
    software: I.IconSoftware,
    palette: I.IconPalette,
    tag: I.IconTag,
    course: I.IconCourse,
    globe: I.IconGlobe,
    team: I.IconTeam,
    bell: I.IconBell,
    shorts: I.IconShorts,
    video: I.IconVideo,
    history: I.IconHistory,
    studio: I.IconStudio,
    dollar: I.IconDollar,
    handshake: I.IconHandshake,
    megaphone: I.IconMegaphone,
    trend: I.IconTrend,
    text: I.IconTextTool,
  };
  const C = map[name] ?? I.IconUpgrade;
  return <C size={size} className={className} />;
}
