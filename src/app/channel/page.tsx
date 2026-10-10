"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGame } from "@/lib/game-engine/GameContext";
import { AvatarRenderer } from "@/components/channel-editor/AvatarRenderer";
import { BannerRenderer } from "@/components/channel-editor/BannerRenderer";
import { VideoCard } from "@/components/game/VideoCard";
import { Card, Stat, Button, Badge, cn } from "@/components/ui";
import { fmt, money, mult } from "@/lib/format";
import {
  IconSubscribers,
  IconViews,
  IconDollar,
  IconBrandScore,
  IconVideo,
  IconShorts,
  IconAnalytics,
  IconNewChannel,
  IconAvatarEditor,
  IconBuyout,
  IconInfo,
  IconSparkles,
} from "@/components/svg/icons";

type Tab = "videos" | "shorts" | "playlists" | "about" | "analytics";

export default function MyChannelPage() {
  const { state, now, mods } = useGame();
  const { channel, videos, stats } = state;
  const [tab, setTab] = useState<Tab>("videos");

  if (!channel) {
    return (
      <Card className="mx-auto mt-10 max-w-lg p-10 text-center">
        <IconNewChannel size={40} className="mx-auto text-slate-500" />
        <h1 className="mt-4 text-2xl font-black text-white">Канал ещё не создан</h1>
        <Link href="/create-channel" className="mt-5 inline-block">
          <Button size="lg">Создать канал</Button>
        </Link>
      </Card>
    );
  }

  const longs = videos.filter((v) => v.type === "video");
  const shorts = videos.filter((v) => v.type === "shorts");
  const byTopic = videos.reduce<Record<string, number>>((a, v) => ({ ...a, [v.topic]: (a[v.topic] || 0) + 1 }), {});
  const valuation = Math.round(stats.subscribers * 0.5 + stats.monthlyRevenue * 18 + channel.brandScore * 100 + channel.reputation * 50);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <Card className="overflow-hidden">
        <BannerRenderer config={channel.banner} channelName={channel.name} height="190px" className="!rounded-none !border-0" />
        <div className="p-4 md:p-6">
          <div className="relative z-10 -mt-14 mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-4">
              <div className="rounded-3xl bg-[#0b0d14] p-1.5">
                <AvatarRenderer config={channel.avatar} size={96} />
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-black text-white md:text-3xl">{channel.name}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>@{channel.name.toLowerCase().replace(/\s+/g, "")}</span>
                  <span>·</span>
                  <span>{fmt(stats.subscribers)} подписчиков</span>
                  <span>·</span>
                  <span>{videos.length} видео</span>
                  <Badge color="red">Ур. {channel.level}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/channel/edit">
                <Button variant="ghost" size="sm">
                  <IconAvatarEditor size={14} /> Оформление
                </Button>
              </Link>
              <Link href="/channel/sell">
                <Button variant="success" size="sm">
                  <IconBuyout size={14} /> Продать канал
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            <Stat icon={<IconSubscribers size={17} />} label="Подписчики" value={fmt(stats.subscribers)} tone="red" />
            <Stat icon={<IconViews size={17} />} label="Просмотры" value={fmt(stats.totalViews)} tone="sky" />
            <Stat icon={<IconDollar size={17} />} label="Доход" value={money(stats.totalRevenue)} tone="emerald" />
            <Stat icon={<IconBrandScore size={17} />} label="Brand Score" value={`${channel.brandScore}/100`} sub={`${mult(mods.brand)} к охвату`} tone="amber" />
          </div>
        </div>
        <div className="flex overflow-x-auto border-t border-white/[0.06] px-3 md:px-6">
          {(
            [
              ["videos", "Видео", IconVideo],
              ["shorts", "Shorts", IconShorts],
              ["playlists", "Плейлисты", IconSparkles],
              ["analytics", "Аналитика", IconAnalytics],
              ["about", "О канале", IconInfo],
            ] as [Tab, string, React.FC<{ size?: number }>][]
          ).map(([id, l, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn("flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-xs font-bold", tab === id ? "border-red-500 text-white" : "border-transparent text-slate-500 hover:text-slate-200")}
            >
              <Icon size={14} /> {l}
            </button>
          ))}
        </div>
      </Card>

      {(tab === "videos" || tab === "shorts") && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(tab === "videos" ? longs : shorts).map((v) => (
            <VideoCard key={v.id} v={v} now={now} />
          ))}
          {(tab === "videos" ? longs : shorts).length === 0 && (
            <Card className="col-span-full p-10 text-center text-sm text-slate-500">
              Здесь пока пусто.{" "}
              <Link href="/create" className="font-bold text-red-300">
                Создать
              </Link>
            </Card>
          )}
        </div>
      )}

      {tab === "playlists" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(byTopic).map(([topic, n]) => (
            <Card key={topic} className="p-4">
              <div className="font-bold text-white">{topic}</div>
              <div className="text-xs text-slate-500">{n} видео · автоплейлист</div>
            </Card>
          ))}
          {Object.keys(byTopic).length === 0 && <Card className="col-span-full p-8 text-center text-sm text-slate-500">Плейлисты появятся после публикации видео</Card>}
        </div>
      )}

      {tab === "analytics" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="space-y-2 p-5 text-sm">
            <h3 className="mb-2 font-black text-white">Влияние оформления</h3>
            {[
              ["Охват новых видео", mult(mods.brand)],
              ["Конверсия подписок", mult(1 + channel.brandScore / 200)],
              ["Частота спонсоров", mult(1 + channel.brandScore / 300)],
              ["Аватар / Баннер", `${channel.avatarScore} / ${channel.bannerScore}`],
              ["Описание / Название", `${channel.descriptionScore} / ${channel.nameScore}`],
            ].map(([a, b]) => (
              <div key={a} className="flex justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                <span className="text-slate-400">{a}</span>
                <span className="font-bold text-white">{b}</span>
              </div>
            ))}
          </Card>
          <Card className="space-y-2 p-5 text-sm">
            <h3 className="mb-2 font-black text-white">Капитализация</h3>
            {[
              ["Оценочная стоимость", money(valuation)],
              ["Доход в месяц", money(stats.monthlyRevenue)],
              ["Репутация", `${channel.reputation}/100`],
              ["Продано каналов", `${stats.soldChannelsCount}`],
            ].map(([a, b]) => (
              <div key={a} className="flex justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                <span className="text-slate-400">{a}</span>
                <span className="font-bold text-white">{b}</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab === "about" && (
        <Card className="p-5">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{channel.description || "Описание не указано."}</p>
          <div className="mt-4 space-y-1 border-t border-white/[0.06] pt-4 text-xs text-slate-500">
            <div>Создан: {new Date(channel.createdAt).toLocaleDateString("ru-RU")}</div>
            <div>Ниша: {channel.topic}</div>
          </div>
        </Card>
      )}
    </div>
  );
}
