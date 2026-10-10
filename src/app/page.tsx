"use client";

import React from "react";
import Link from "next/link";
import { useGame } from "@/lib/game-engine/GameContext";
import { OnboardingBanner } from "@/components/game/OnboardingBanner";
import { AvatarRenderer } from "@/components/channel-editor/AvatarRenderer";
import { BannerRenderer } from "@/components/channel-editor/BannerRenderer";
import { VideoCard } from "@/components/game/VideoCard";
import { Card, Stat, Button, Badge, Progress } from "@/components/ui";
import { trendForTopic } from "@/lib/game-engine/engine";
import { fmt, money, mult } from "@/lib/format";
import {
  IconPlay,
  IconUpgrade,
  IconBuyout,
  IconSubscribers,
  IconViews,
  IconDollar,
  IconBrandScore,
  IconNewChannel,
  IconFlame,
  IconFilm,
  IconOffer,
  IconChevronRight,
} from "@/components/svg/icons";

export default function HomePage() {
  const { state, now, mods, activeBuyoutCountdown } = useGame();
  const { channel, stats, videos, activeBuyoutOffer } = state;
  const hasOffer = activeBuyoutOffer?.status === "active";
  const prod = videos.filter((v) => v.status === "production");
  const recent = videos.filter((v) => v.status === "published").slice(0, 8);
  const topTrends = [...state.trends].sort((a, b) => b.hype - a.hype).slice(0, 3);
  const nicheTrend = channel ? trendForTopic(state, channel.topic, mods).trend : null;

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <OnboardingBanner />

      {hasOffer && (
        <Card glow="emerald" className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
              <IconBuyout size={22} />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Оффер на выкуп · {activeBuyoutCountdown} сек</div>
              <div className="font-black text-white">
                {activeBuyoutOffer!.buyerName} предлагает <span className="text-emerald-300">{money(activeBuyoutOffer!.currentOfferPrice)}</span>
              </div>
            </div>
          </div>
          <Link href="/channel/sell">
            <Button variant="success">Рассмотреть</Button>
          </Link>
        </Card>
      )}

      {channel ? (
        <Card className="overflow-hidden">
          <BannerRenderer config={channel.banner} channelName={channel.name} height="140px" className="!rounded-none !border-0" />
          <div className="p-4 md:p-5">
            <div className="relative z-10 -mt-12 mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-3">
                <div className="rounded-2xl bg-[#0b0d14] p-1">
                  <AvatarRenderer config={channel.avatar} size={72} />
                </div>
                <div className="pb-1">
                  <h2 className="text-xl font-black text-white">{channel.name}</h2>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                    <Badge color="red">Ур. {channel.level}</Badge>
                    <span>{channel.topic}</span>
                    {nicheTrend && (
                      <Badge color="amber">
                        <IconFlame size={10} /> ниша в тренде
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/studio">
                  <Button variant="ghost" size="sm">
                    <IconFilm size={14} /> Студия
                  </Button>
                </Link>
                <Link href="/create">
                  <Button size="sm">
                    <IconPlay size={14} /> Снять видео
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              <Stat icon={<IconSubscribers size={17} />} label="Подписчики" value={fmt(stats.subscribers)} sub={`+${fmt(stats.subsPerSec * 60)}/мин`} tone="red" />
              <Stat icon={<IconViews size={17} />} label="Просмотры" value={fmt(stats.totalViews)} sub={`+${fmt(stats.viewsPerSec)}/сек`} tone="sky" />
              <Stat icon={<IconDollar size={17} />} label="Доход в месяц" value={money(stats.monthlyRevenue)} sub={`${money(stats.revenuePerSec)}/сек`} tone="emerald" />
              <Stat icon={<IconBrandScore size={17} />} label="Brand Score" value={`${channel.brandScore}/100`} sub={`Оформление: ${mult(mods.brand)} к охвату`} tone="amber" />
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center" glow="red">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 text-red-300">
            <IconNewChannel size={30} />
          </div>
          <h2 className="mt-4 text-2xl font-black text-white">Ваш путь начинается здесь</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">
            На счету $500. Создайте канал, соберите аватар и баннер в SVG-конструкторе — оформление напрямую влияет на охваты.
          </p>
          <Link href="/create-channel" className="mt-5 inline-block">
            <Button size="lg">
              <IconNewChannel size={16} /> Создать канал
            </Button>
          </Link>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {prod.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-sky-300">В производстве</div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {prod.map((v) => (
                  <VideoCard key={v.id} v={v} now={now} />
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Последние видео</span>
              <Link href="/studio" className="flex items-center gap-0.5 text-xs font-bold text-red-300">
                Все <IconChevronRight size={12} />
              </Link>
            </div>
            {recent.length === 0 ? (
              <Card className="p-8 text-center text-sm text-slate-500">Опубликованных видео пока нет.</Card>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {recent.map((v) => (
                  <VideoCard key={v.id} v={v} now={now} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-black text-white">
                <IconFlame size={16} className="text-amber-400" /> Горячие тренды
              </span>
              <Link href="/trends" className="text-xs font-bold text-red-300">
                Все
              </Link>
            </div>
            <div className="space-y-3">
              {topTrends.map((t) => (
                <div key={t.id}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate font-semibold text-slate-200">{t.topic}</span>
                    <span className="shrink-0 font-bold text-amber-300">{mult(1 + (t.baseViewsMult - 1) * (t.hype / 100) * mods.trend)}</span>
                  </div>
                  <div className="mb-1 text-[10px] text-slate-500">{t.category}</div>
                  <Progress value={t.hype} color="from-amber-500 to-red-500" />
                </div>
              ))}
            </div>
          </Card>

          <Link href="/offers" className="block">
            <Card className="flex items-center gap-3 p-4 transition-colors hover:bg-white/[0.05]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                <IconOffer size={18} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">Рекламные предложения</div>
                <div className="text-xs text-slate-500">{state.adOffers.length} активных офферов</div>
              </div>
              <IconChevronRight size={16} className="text-slate-500" />
            </Card>
          </Link>
          <Link href="/upgrades" className="block">
            <Card className="flex items-center gap-3 p-4 transition-colors hover:bg-white/[0.05]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300">
                <IconUpgrade size={18} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">Апгрейды</div>
                <div className="text-xs text-slate-500">Охват {mult(mods.reach)} · CTR {mult(mods.ctr)}</div>
              </div>
              <IconChevronRight size={16} className="text-slate-500" />
            </Card>
          </Link>
          <Link href="/channel/sell" className="block">
            <Card className="flex items-center gap-3 p-4 transition-colors hover:bg-white/[0.05]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                <IconBuyout size={18} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">Продажа канала</div>
                <div className="text-xs text-slate-500">{stats.subscribers >= 100 ? "Покупатели следят за каналом" : "Нужно 100+ подписчиков"}</div>
              </div>
              <IconChevronRight size={16} className="text-slate-500" />
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
