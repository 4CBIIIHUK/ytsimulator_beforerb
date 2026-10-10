"use client";

import React from "react";
import Link from "next/link";
import { VideoItem } from "@/types/game";
import { ThumbnailRenderer } from "./ThumbnailRenderer";
import { fmt, money, duration } from "@/lib/format";
import { Badge, Progress } from "@/components/ui";
import { IconViews, IconDollar, IconSubscribers, IconFlame, IconClock } from "@/components/svg/icons";

export const VideoCard: React.FC<{ v: VideoItem; now: number; compact?: boolean }> = ({ v, now, compact }) => {
  const inProd = v.status === "production";
  const progress = inProd ? Math.min(100, ((now - v.createdAt) / v.productionMs) * 100) : 100;
  const left = Math.max(0, Math.ceil((v.readyAt - now) / 1000));
  return (
    <Link
      href={`/studio/${v.id}`}
      className="group block overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] transition-all hover:-translate-y-0.5 hover:border-red-500/40 hover:bg-white/[0.05]"
    >
      <div className={`relative overflow-hidden ${v.type === "shorts" ? "aspect-video bg-black" : "aspect-video"}`}>
        <div className={v.type === "shorts" ? "mx-auto h-full aspect-[9/16]" : "h-full w-full"}>
          <ThumbnailRenderer text={v.thumbnailText} topic={v.topic} style={v.thumbnailStyle} tier={v.boosts.thumbnailTier} type={v.type} />
        </div>
        <div className="absolute left-2 top-2 flex gap-1">
          {v.type === "shorts" && <Badge color="red">Shorts</Badge>}
          {v.trendMult > 1.05 && (
            <Badge color="amber">
              <IconFlame size={10} /> Тренд
            </Badge>
          )}
          {v.viralMult > 3 && <Badge color="emerald">Вирус</Badge>}
        </div>
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">{duration(v.duration)}</span>
        {inProd && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 backdrop-blur-[2px]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <IconClock size={14} className="animate-pulse text-red-400" />
              Монтаж и загрузка... {left}с
            </div>
            <div className="w-2/3">
              <Progress value={progress} />
            </div>
            <span className="text-[10px] text-slate-300">Нажмите, чтобы купить продвижение до выхода</span>
          </div>
        )}
      </div>
      <div className="space-y-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-red-300">{v.title}</h3>
        {!compact && !inProd && (
          <div className="flex items-center justify-between text-[11px] text-slate-400 tabular-nums">
            <span className="flex items-center gap-1">
              <IconViews size={12} /> {fmt(v.views)}
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <IconDollar size={12} /> {money(v.revenue)}
            </span>
            <span className="flex items-center gap-1">
              <IconSubscribers size={12} /> +{fmt(v.subsGained)}
            </span>
          </div>
        )}
        {!inProd && v.lastVps > 0.5 && <div className="text-[10px] font-semibold text-sky-400">+{fmt(v.lastVps)} просм/сек</div>}
      </div>
    </Link>
  );
};
