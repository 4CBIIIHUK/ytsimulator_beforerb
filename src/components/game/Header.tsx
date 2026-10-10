"use client";

import React from "react";
import Link from "next/link";
import { useGame } from "@/lib/game-engine/GameContext";
import { AvatarRenderer } from "@/components/channel-editor/AvatarRenderer";
import { fmt, money } from "@/lib/format";
import { IconDollar, IconSubscribers, IconViews, IconSoundOn, IconSoundOff, IconBuyout, IconPlus, IconMenu, IconClock } from "@/components/svg/icons";

export const Header: React.FC<{ onMenu: () => void }> = ({ onMenu }) => {
  const { state, toggleSound, activeBuyoutCountdown, timeUntilNextBuyoutCheck } = useGame();
  const { balance, channel, stats, settings, activeBuyoutOffer } = state;
  const hasOffer = activeBuyoutOffer?.status === "active";

  return (
    <header className="z-20 flex h-14 shrink-0 select-none items-center justify-between gap-2 border-b border-white/[0.06] bg-[#0b0d14]/80 px-3 backdrop-blur-xl md:h-16 md:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button onClick={onMenu} className="rounded-lg p-2 text-slate-300 hover:bg-white/5 lg:hidden" aria-label="Меню">
          <IconMenu size={20} />
        </button>
        {channel ? (
          <Link href="/channel" className="flex min-w-0 items-center gap-2.5">
            <AvatarRenderer config={channel.avatar} size={34} />
            <div className="hidden min-w-0 sm:block">
              <div className="truncate text-sm font-bold text-white">{channel.name}</div>
              <div className="text-[10px] text-slate-500">
                Ур. {channel.level} · {channel.topic}
              </div>
            </div>
          </Link>
        ) : (
          <Link href="/create-channel" className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white">
            <IconPlus size={14} /> <span className="hidden sm:inline">Создать канал</span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-1.5 md:gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5">
          <IconDollar size={15} className="text-emerald-400" />
          <div className="leading-none">
            <div className="text-sm font-black tabular-nums text-emerald-300">{money(balance)}</div>
            {stats.revenuePerSec > 0.001 && <div className="mt-0.5 text-[9px] font-semibold text-emerald-500/80">+{money(stats.revenuePerSec)}/с</div>}
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5">
          <IconSubscribers size={15} className="text-red-400" />
          <div className="leading-none">
            <div className="text-sm font-black tabular-nums text-white">{fmt(stats.subscribers)}</div>
            {stats.subsPerSec > 0.01 && <div className="mt-0.5 text-[9px] font-semibold text-red-400/80">+{fmt(stats.subsPerSec)}/с</div>}
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 md:flex">
          <IconViews size={15} className="text-sky-400" />
          <div className="leading-none">
            <div className="text-sm font-black tabular-nums text-white">{fmt(stats.totalViews)}</div>
            {stats.viewsPerSec > 0.1 && <div className="mt-0.5 text-[9px] font-semibold text-sky-400/80">+{fmt(stats.viewsPerSec)}/с</div>}
          </div>
        </div>

        {hasOffer ? (
          <Link href="/channel/sell" className="hidden animate-pulse items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-black text-slate-950 sm:flex">
            <IconBuyout size={15} /> {money(activeBuyoutOffer!.currentOfferPrice)} · {activeBuyoutCountdown}с
          </Link>
        ) : (
          channel &&
          stats.subscribers >= 100 && (
            <div className="hidden items-center gap-1.5 rounded-xl border border-white/[0.07] px-2.5 py-2 text-[11px] text-slate-400 xl:flex">
              <IconClock size={13} /> Оффер ~{Math.floor(timeUntilNextBuyoutCheck / 60)}:{String(timeUntilNextBuyoutCheck % 60).padStart(2, "0")}
            </div>
          )
        )}

        <button onClick={toggleSound} className="rounded-lg border border-white/[0.07] p-2 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Звук">
          {settings.soundEnabled ? <IconSoundOn size={16} /> : <IconSoundOff size={16} />}
        </button>
      </div>
    </header>
  );
};
