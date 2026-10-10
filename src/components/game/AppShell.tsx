"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGame } from "@/lib/game-engine/GameContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/components/ui";
import { IconHome, IconCreate, IconFilm, IconUpgrade, IconChannel, IconCheck, IconInfo, IconDollar, IconCross } from "@/components/svg/icons";

function Toaster() {
  const { toasts, dismissToast } = useGame();
  return (
    <div className="pointer-events-none fixed right-3 top-16 z-50 flex w-[min(360px,calc(100vw-24px))] flex-col gap-2 md:top-20">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "toast-in pointer-events-auto flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm shadow-2xl backdrop-blur-xl",
            t.kind === "success" && "border-emerald-500/30 bg-emerald-950/80 text-emerald-100",
            t.kind === "money" && "border-amber-500/30 bg-amber-950/80 text-amber-100",
            t.kind === "warning" && "border-red-500/30 bg-red-950/80 text-red-100",
            t.kind === "info" && "border-sky-500/30 bg-slate-900/90 text-slate-100"
          )}
        >
          <span className="mt-0.5 shrink-0">
            {t.kind === "money" ? <IconDollar size={15} /> : t.kind === "success" ? <IconCheck size={15} /> : <IconInfo size={15} />}
          </span>
          <span className="flex-1 leading-snug">{t.text}</span>
          <button onClick={() => dismissToast(t.id)} className="opacity-50 hover:opacity-100">
            <IconCross size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const { state } = useGame();
  const items = [
    { href: "/", label: "Главная", icon: IconHome },
    { href: state.channel ? "/channel" : "/create-channel", label: "Канал", icon: IconChannel },
    { href: "/create", label: "Создать", icon: IconCreate, main: true },
    { href: "/studio", label: "Студия", icon: IconFilm },
    { href: "/upgrades", label: "Апгрейды", icon: IconUpgrade },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-white/[0.07] bg-[#0b0d14]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      {items.map((it) => {
        const active = pathname === it.href || (it.href !== "/" && pathname.startsWith(it.href + "/") && it.href !== "/channel");
        const Icon = it.icon;
        return (
          <Link key={it.href} href={it.href} className={cn("flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold", active ? "text-white" : "text-slate-500")}>
            {it.main ? (
              <span className="-mt-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-700 text-white shadow-lg shadow-red-900/50">
                <Icon size={20} />
              </span>
            ) : (
              <Icon size={20} className={active ? "text-red-400" : ""} />
            )}
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Splash() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#07080d]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-700 shadow-2xl shadow-red-900/50">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
            <polygon points="8 5 19 12 8 19" />
          </svg>
        </div>
        <div className="text-sm font-bold tracking-widest text-slate-400">ЗАГРУЗКА СТУДИИ...</div>
      </div>
    </div>
  );
}

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded } = useGame();
  const [open, setOpen] = useState(false);
  if (!isLoaded) return <Splash />;
  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden">
      <Sidebar className="hidden lg:flex" />
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <Sidebar className="drawer-in relative z-10 h-full" onNavigate={() => setOpen(false)} />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenu={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto px-3 pb-24 pt-4 md:px-6 md:pt-6 lg:px-8 lg:pb-10">{children}</main>
      </div>
      <MobileNav />
      <Toaster />
    </div>
  );
};
