"use client";

import React from "react";
import Link from "next/link";
import { useGame } from "@/lib/game-engine/GameContext";
import { trendForTopic } from "@/lib/game-engine/engine";
import { Card, PageHeader, Badge, Progress } from "@/components/ui";
import { IconTrend, IconFlame, IconPlay, IconArrowUp, IconArrowDown, IconViews, IconDollar, IconSubscribers } from "@/components/svg/icons";
import { fmt, mult } from "@/lib/format";

export default function TrendsPage() {
  const { state, mods } = useGame();
  const trends = [...state.trends].sort((a, b) => b.hype - a.hype);
  const channelTrend = state.channel ? trendForTopic(state, state.channel.topic, mods) : null;
  const passive =
    channelTrend?.trend && state.channel
      ? (0.4 + state.stats.subscribers * 0.0003) * (channelTrend.trend.hype / 100) * Math.sqrt(mods.trend) * mods.brand
      : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader
        icon={<IconTrend size={13} />}
        kicker="Живые тренды"
        title="Тренды платформы"
        desc="Тренды зарождаются, достигают пика и угасают за несколько минут. Видео в трендовой теме получают множитель охвата и RPM, а если ваша ниша в тренде — канал растёт сам."
        right={
          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Радар трендов</div>
            <div className="text-lg font-black text-amber-300">{mult(mods.trend)}</div>
          </div>
        }
      />

      {state.channel && (
        <Card className="p-4" glow={passive > 0 ? "amber" : "none"}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                <IconSubscribers size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {passive > 0 ? `Ниша «${state.channel.topic}» в тренде — канал растёт сам` : `Ниша «${state.channel.topic}» сейчас не в тренде`}
                </div>
                <div className="text-xs text-slate-500">
                  {passive > 0 ? `+${fmt(passive * 60)} подписчиков в минуту без новых видео` : "Снимайте видео на трендовые темы из других ниш или ждите волны"}
                </div>
              </div>
            </div>
            {passive > 0 && <Badge color="amber">{channelTrend?.trend?.topic}</Badge>}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {trends.map((t) => {
          const vm = 1 + (t.baseViewsMult - 1) * (t.hype / 100) * mods.trend;
          const cm = 1 + (t.cpmMult - 1) * (t.hype / 100);
          const mine = state.channel?.topic === t.category;
          return (
            <Card key={t.id} className="p-4" glow={mine ? "red" : "none"}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/25 to-red-500/10 text-amber-300">
                    <IconFlame size={18} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge>{t.category}</Badge>
                      {mine && <Badge color="red">Ваша ниша</Badge>}
                    </div>
                    <h3 className="mt-1 font-bold text-white">{t.topic}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold">
                  {t.momentum === "up" ? (
                    <span className="flex items-center gap-1 text-emerald-300">
                      <IconArrowUp size={13} /> Растёт
                    </span>
                  ) : t.momentum === "peak" ? (
                    <span className="flex items-center gap-1 text-amber-300">
                      <IconFlame size={13} /> Пик
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-300">
                      <IconArrowDown size={13} /> Угасает
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-[11px] text-slate-500">
                  <span>Хайп</span>
                  <span className="font-bold tabular-nums text-white">{Math.round(t.hype)}/100</span>
                </div>
                <Progress value={t.hype} color="from-amber-500 to-red-500" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] p-2 text-xs">
                  <IconViews size={14} className="text-sky-400" />
                  <span className="text-slate-500">Охват</span>
                  <span className="ml-auto font-black text-emerald-300">{mult(vm)}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] p-2 text-xs">
                  <IconDollar size={14} className="text-emerald-400" />
                  <span className="text-slate-500">RPM</span>
                  <span className="ml-auto font-black text-emerald-300">{mult(cm)}</span>
                </div>
              </div>
              <Link href="/create" className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-white/[0.05] py-2 text-xs font-bold text-slate-200 hover:bg-white/10">
                <IconPlay size={12} /> Снять видео в категории «{t.category}»
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
