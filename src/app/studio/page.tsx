"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGame } from "@/lib/game-engine/GameContext";
import { Card, PageHeader, cn } from "@/components/ui";
import { VideoCard } from "@/components/game/VideoCard";
import { IconFilm, IconPlus } from "@/components/svg/icons";
import { fmt, money } from "@/lib/format";

type Filter = "all" | "production" | "video" | "shorts" | "top";

export default function StudioPage() {
  const { state, now } = useGame();
  const [filter, setFilter] = useState<Filter>("all");
  const prod = state.videos.filter((v) => v.status === "production");
  let list = state.videos.filter((v) => v.status === "published");
  if (filter === "video") list = list.filter((v) => v.type === "video");
  if (filter === "shorts") list = list.filter((v) => v.type === "shorts");
  if (filter === "top") list = [...list].sort((a, b) => b.views - a.views);
  if (filter === "production") list = [];

  const totalViews = state.videos.reduce((a, v) => a + v.views, 0);
  const totalRev = state.videos.reduce((a, v) => a + v.revenue, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <PageHeader
        icon={<IconFilm size={13} />}
        kicker="Управление контентом"
        title="Студия видео"
        desc="Откройте любое видео, чтобы купить превью, рекламу, SEO, субтитры и другие бусты — как до выхода, так и после."
        right={
          <Link href="/create" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-red-500 to-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-900/40">
            <IconPlus size={16} /> Новое видео
          </Link>
        }
      />

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Видео</div>
          <div className="text-xl font-black text-white">{state.videos.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Просмотры</div>
          <div className="text-xl font-black text-white">{fmt(totalViews)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Доход</div>
          <div className="text-xl font-black text-emerald-300">{money(totalRev)}</div>
        </Card>
      </div>

      {prod.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-sky-300">В производстве · можно купить продвижение до выхода</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {prod.map((v) => (
              <VideoCard key={v.id} v={v} now={now} />
            ))}
          </div>
        </div>
      )}

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1">
        {(
          [
            ["all", "Все"],
            ["video", "Длинные"],
            ["shorts", "Shorts"],
            ["top", "Популярные"],
          ] as [Filter, string][]
        ).map(([id, l]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={cn("whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold", filter === id ? "bg-white text-slate-900" : "border border-white/10 text-slate-400 hover:text-white")}
          >
            {l}
          </button>
        ))}
      </div>

      {list.length === 0 && prod.length === 0 ? (
        <Card className="p-10 text-center">
          <div className="text-lg font-bold text-white">Видео пока нет</div>
          <p className="mt-1 text-sm text-slate-500">Снимите первое видео — оно появится здесь.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((v) => (
            <VideoCard key={v.id} v={v} now={now} />
          ))}
        </div>
      )}
    </div>
  );
}
