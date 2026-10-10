"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGame } from "@/lib/game-engine/GameContext";
import { cn } from "@/components/ui";
import {
  IconHome,
  IconChannel,
  IconUpgrade,
  IconCreate,
  IconTeam,
  IconOffer,
  IconBuyout,
  IconTrend,
  IconTrophy,
  IconNetwork,
  IconSettings,
  IconNewChannel,
  IconFilm,
} from "@/components/svg/icons";

export function useNavItems() {
  const { state } = useGame();
  const hasChannel = state.channel !== null;
  const activeOffer = state.activeBuyoutOffer?.status === "active";
  const ads = state.adOffers.length;
  const inProd = state.videos.filter((v) => v.status === "production").length;
  return [
    { href: "/", label: "Главная", icon: IconHome },
    { href: hasChannel ? "/channel" : "/create-channel", label: hasChannel ? "Мой канал" : "Создать канал", icon: hasChannel ? IconChannel : IconNewChannel, badge: !hasChannel ? "Старт" : null, badgeColor: "bg-red-500" },
    { href: "/upgrades", label: "Апгрейды", icon: IconUpgrade },
    { href: "/create", label: "Создать", icon: IconCreate },
    { href: "/studio", label: "Студия видео", icon: IconFilm, badge: inProd > 0 ? `${inProd}` : null, badgeColor: "bg-sky-500" },
    { href: "/team", label: "Команда", icon: IconTeam },
    { href: "/offers", label: "Реклама", icon: IconOffer, badge: ads > 0 ? `${ads}` : null, badgeColor: "bg-amber-500" },
    { href: "/channel/sell", label: "Продажа канала", icon: IconBuyout, badge: activeOffer ? "Оффер" : null, badgeColor: "bg-emerald-500 animate-pulse", highlight: activeOffer },
    { href: "/trends", label: "Тренды", icon: IconTrend },
    { href: "/leaderboards", label: "Лидерборды", icon: IconTrophy },
    { href: "/networks", label: "Сети каналов", icon: IconNetwork, badge: state.stats.soldChannelsCount >= 10 ? "Открыто" : `${state.stats.soldChannelsCount}/10`, badgeColor: state.stats.soldChannelsCount >= 10 ? "bg-violet-500" : "bg-white/10" },
    { href: "/settings", label: "Настройки", icon: IconSettings },
  ];
}

export const Sidebar: React.FC<{ onNavigate?: () => void; className?: string }> = ({ onNavigate, className }) => {
  const pathname = usePathname();
  const { state } = useGame();
  const items = useNavItems();

  return (
    <aside className={cn("flex w-64 shrink-0 select-none flex-col border-r border-white/[0.06] bg-[#0b0d14]/95", className)}>
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-700 text-white shadow-lg shadow-red-900/40">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="8 5 19 12 8 19" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-black tracking-wide text-white">YouTuber</div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">Simulator</div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/") && item.href !== "/channel");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-to-r from-red-500/20 to-transparent text-white"
                  : item.highlight
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
              )}
            >
              {active && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-red-500" />}
              <span className="flex items-center gap-3">
                <Icon size={18} className={active ? "text-red-400" : ""} />
                {item.label}
              </span>
              {item.badge && <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white", item.badgeColor)}>{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-4">
        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
          <span>Мета-бонус продаж</span>
          <span className="font-bold text-emerald-400">+{state.stats.soldChannelsCount * 10}% охвата</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${Math.min(100, state.stats.soldChannelsCount * 10)}%` }} />
        </div>
      </div>
    </aside>
  );
};
