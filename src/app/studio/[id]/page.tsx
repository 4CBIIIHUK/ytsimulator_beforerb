"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGame } from "@/lib/game-engine/GameContext";
import { THUMBNAIL_TIERS, BOOST_DEFS, AD_PACKAGES } from "@/lib/game-engine/constants";
import { thumbnailCost, boostCost, adPackageViews, rushCost, videoPeff, boostReachMult, boostSubsMult } from "@/lib/game-engine/engine";
import { Card, Button, Badge, Progress, Stat, cn } from "@/components/ui";
import { ThumbnailRenderer } from "@/components/game/ThumbnailRenderer";
import { BoostKey } from "@/types/game";
import { fmt, money, mult, duration, ago } from "@/lib/format";
import {
  IconViews,
  IconDollar,
  IconSubscribers,
  IconLike,
  IconDislike,
  IconImage,
  IconMegaphone,
  IconRocket,
  IconClock,
  IconCheck,
  IconTag,
  IconGlobe,
  IconPin,
  IconBell,
  IconSparkles,
  IconFlame,
  IconComment,
  IconChevronRight,
  IconTarget,
  IconAnalytics,
} from "@/components/svg/icons";

const BOOST_ICONS: Record<BoostKey, React.ReactNode> = {
  titleAB: <IconSparkles size={16} />,
  seoPack: <IconTag size={16} />,
  subtitles: <IconGlobe size={16} />,
  endScreen: <IconBell size={16} />,
  premiere: <IconRocket size={16} />,
  pinnedComment: <IconPin size={16} />,
  hashtags: <IconTarget size={16} />,
};

export default function VideoManagePage() {
  const params = useParams<{ id: string }>();
  const { state, mods, now, buyThumbnail, buyBoost, buyAdCampaign, rushProduction } = useGame();
  const v = state.videos.find((x) => x.id === params.id);

  if (!v) {
    return (
      <Card className="mx-auto mt-10 max-w-md p-8 text-center">
        <h2 className="text-lg font-bold text-white">Видео не найдено</h2>
        <Link href="/studio" className="mt-4 inline-block text-sm font-bold text-red-300">
          Вернуться в студию
        </Link>
      </Card>
    );
  }

  const inProd = v.status === "production";
  const left = Math.max(0, Math.ceil((v.readyAt - now) / 1000));
  const prog = inProd ? Math.min(100, ((now - v.createdAt) / v.productionMs) * 100) : 100;
  const age = inProd ? 0 : (now - v.publishedAt) / 1000;
  const tau = v.type === "shorts" ? 45 : 90;
  const phase = inProd ? "Монтаж" : age < tau * 0.7 ? "Тест на аудитории" : age < tau * 2.5 ? "Пик рекомендаций" : age < tau * 6 ? "Затухание" : "Длинный хвост";
  const peff = inProd ? 0 : videoPeff(v);
  const ctr = Math.min(30, 2.5 * (THUMBNAIL_TIERS[v.boosts.thumbnailTier]?.mult ?? 1) * Math.pow(mods.ctr, 0.35) * (v.boosts.titleAB ? 1.15 : 1));
  const retention = v.type === "shorts" ? Math.min(140, 55 + v.quality * 0.7) : Math.min(78, 18 + v.quality * 0.55);
  const pendingAd = v.campaigns.filter((c) => c.startAt === 0).reduce((a, c) => a + c.totalViews, 0);
  const organicViews = v.views - v.adViews;

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/studio" className="hover:text-white">
          Студия
        </Link>
        <IconChevronRight size={12} />
        <span className="truncate text-slate-300">{v.title}</span>
      </div>

      {/* HERO */}
      <Card className="overflow-hidden" glow={inProd ? "red" : "none"}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_1fr]">
          <div className={cn("relative bg-black", v.type === "shorts" ? "flex justify-center" : "")}>
            <div className={v.type === "shorts" ? "aspect-[9/16] h-[360px]" : "aspect-video"}>
              <ThumbnailRenderer text={v.thumbnailText} topic={v.topic} style={v.thumbnailStyle} tier={v.boosts.thumbnailTier} type={v.type} />
            </div>
            <span className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-0.5 font-mono text-xs font-bold">{duration(v.duration)}</span>
          </div>
          <div className="flex flex-col gap-4 p-5">
            <div className="flex flex-wrap gap-1.5">
              <Badge color={inProd ? "sky" : "emerald"}>{inProd ? "В производстве" : "Опубликовано"}</Badge>
              <Badge>{v.type === "shorts" ? "Shorts" : "Видео"}</Badge>
              <Badge>{v.topic}</Badge>
              {v.goodLength ? <Badge color="emerald">Хорошая длина</Badge> : <Badge color="amber">Неоптимальная длина</Badge>}
              {v.trendName && (
                <Badge color="amber">
                  <IconFlame size={10} /> {v.trendName} {mult(v.trendMult)}
                </Badge>
              )}
              {v.viralMult > 3 && <Badge color="emerald">Вирусное {mult(v.viralMult)}</Badge>}
            </div>
            <h1 className="text-xl font-black leading-tight text-white md:text-2xl">{v.title}</h1>

            {inProd ? (
              <div className="space-y-3 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-bold text-sky-200">
                    <IconClock size={16} className="animate-pulse" /> Монтаж и загрузка
                  </span>
                  <span className="font-mono text-lg font-black text-white">{left}с</span>
                </div>
                <Progress value={prog} color="from-sky-500 to-cyan-300" />
                <p className="text-xs text-slate-400">
                  Сейчас лучшее время подготовить запуск: реклама, купленная до выхода, стартует в момент публикации и дополнительно разгоняет алгоритм (+25% от рекламных
                  показов к органике). Премьера доступна только сейчас.
                </p>
                {pendingAd > 0 && <div className="text-xs font-bold text-amber-300">Реклама на старте: ~{fmt(pendingAd)} показов</div>}
                <Button variant="ghost" size="sm" onClick={() => rushProduction(v.id)}>
                  <IconRocket size={14} /> Ускорить выход · {money(rushCost(state, v, now))}
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Stat icon={<IconViews size={16} />} label="Просмотры" value={fmt(v.views)} sub={`+${fmt(v.lastVps)}/сек`} tone="sky" />
                  <Stat icon={<IconDollar size={16} />} label="Доход" value={money(v.revenue)} tone="emerald" />
                  <Stat icon={<IconSubscribers size={16} />} label="Подписки" value={`+${fmt(v.subsGained)}`} tone="red" />
                  <Stat icon={<IconLike size={16} />} label="Лайки" value={fmt(v.likes)} sub={`${fmt(v.dislikes)} дизлайков`} tone="amber" />
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-black/25 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Фаза рекомендаций</span>
                    <span className="font-bold text-white">{phase}</span>
                  </div>
                  <Progress value={Math.min(100, (organicViews / Math.max(1, peff)) * 100)} className="mt-2" color="from-sky-500 to-violet-400" />
                  <div className="mt-1.5 flex justify-between text-[10px] text-slate-500">
                    <span>Опубликовано {ago(now - v.publishedAt)}</span>
                    <span>Потенциал волны ~{fmt(peff)}</span>
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-white/[0.03] p-2">
                <div className="text-[10px] text-slate-500">CTR</div>
                <div className="font-black text-white">{ctr.toFixed(1)}%</div>
              </div>
              <div className="rounded-xl bg-white/[0.03] p-2">
                <div className="text-[10px] text-slate-500">{v.type === "shorts" ? "Просмотрено" : "Удержание"}</div>
                <div className="font-black text-white">{retention.toFixed(0)}%</div>
              </div>
              <div className="rounded-xl bg-white/[0.03] p-2">
                <div className="text-[10px] text-slate-500">Множитель бустов</div>
                <div className="font-black text-emerald-300">{mult(boostReachMult(v.boosts))}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* THUMBNAILS */}
        <Card className="p-5">
          <div className="mb-1 flex items-center gap-2">
            <IconImage size={18} className="text-red-400" />
            <h2 className="font-black text-white">Превью</h2>
          </div>
          <p className="mb-4 text-xs text-slate-500">Лучшее превью = больше кликов. Действует на всю оставшуюся волну рекомендаций и хвост.</p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {THUMBNAIL_TIERS.map((t) => {
              const owned = v.boosts.thumbnailTier >= t.tier;
              const current = v.boosts.thumbnailTier === t.tier;
              const cost = thumbnailCost(state, t.tier);
              return (
                <div key={t.tier} className={cn("overflow-hidden rounded-xl border", current ? "border-emerald-500/50" : "border-white/[0.07]")}>
                  <div className="aspect-video bg-black">
                    <ThumbnailRenderer text={v.thumbnailText} topic={v.topic} style={v.thumbnailStyle} tier={t.tier} type="video" />
                  </div>
                  <div className="space-y-2 p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{t.name}</span>
                      <span className="text-xs font-black text-emerald-300">{mult(t.mult)}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{t.desc}</div>
                    {current ? (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-300">
                        <IconCheck size={12} /> Установлено
                      </div>
                    ) : owned ? (
                      <div className="text-[11px] text-slate-600">Ниже текущего</div>
                    ) : (
                      <Button size="sm" className="w-full" disabled={state.balance < cost} onClick={() => buyThumbnail(v.id, t.tier)}>
                        Заказать · {money(cost)}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-5">
          {/* ADS */}
          <Card className="p-5">
            <div className="mb-1 flex items-center gap-2">
              <IconMegaphone size={18} className="text-amber-400" />
              <h2 className="font-black text-white">Реклама видео</h2>
            </div>
            <p className="mb-4 text-xs text-slate-500">
              {inProd ? "Кампании стартуют в момент публикации и разгоняют алгоритм." : "Показы доставляются в течение ~40 сек."} Эффективность рекламного кабинета: {mult(mods.ads)}.
            </p>
            <div className="space-y-2">
              {AD_PACKAGES.map((p) => {
                const views = adPackageViews(state, v.type, p.cost);
                return (
                  <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2.5">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white">{p.name}</div>
                      <div className="text-[11px] text-slate-500">~{fmt(views)} показов{inProd ? ` + ${fmt(views * 0.25)} органики` : ""}</div>
                    </div>
                    <Button size="sm" variant="warning" disabled={state.balance < p.cost} onClick={() => buyAdCampaign(v.id, p.id)}>
                      {money(p.cost)}
                    </Button>
                  </div>
                );
              })}
            </div>
            {v.campaigns.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-white/[0.06] pt-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Кампании</div>
                {v.campaigns.map((c) => (
                  <div key={c.id} className="text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>
                        {c.name} {c.prelaunch && <span className="text-amber-300">(старт)</span>}
                      </span>
                      <span className="tabular-nums">
                        {fmt(c.delivered)} / {fmt(c.totalViews)}
                      </span>
                    </div>
                    <Progress value={c.startAt === 0 ? 0 : (c.delivered / c.totalViews) * 100} color="from-amber-500 to-yellow-300" className="mt-1" />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* BOOSTS */}
          <Card className="p-5">
            <div className="mb-1 flex items-center gap-2">
              <IconRocket size={18} className="text-violet-400" />
              <h2 className="font-black text-white">Оптимизация</h2>
            </div>
            <p className="mb-4 text-xs text-slate-500">
              Охват x{boostReachMult(v.boosts).toFixed(2)} · Конверсия в подписки x{boostSubsMult(v.boosts).toFixed(2)}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {(Object.keys(BOOST_DEFS) as BoostKey[]).map((k) => {
                const d = BOOST_DEFS[k];
                const owned = v.boosts[k];
                const blocked = (d.longOnly && v.type !== "video") || (d.shortsOnly && v.type !== "shorts") || (d.preOnly && !inProd && !owned);
                const cost = boostCost(state, k);
                return (
                  <div key={k} className={cn("rounded-xl border p-3", owned ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/[0.06] bg-black/20", blocked && "opacity-40")}>
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <span className="text-violet-300">{BOOST_ICONS[k]}</span>
                      {d.name}
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500">{d.desc}</div>
                    <div className="mt-1 text-[11px] font-semibold text-emerald-300">
                      {d.reach > 1 && `Охват ${mult(d.reach)}`} {d.subs > 1 && `· Подписки ${mult(d.subs)}`}
                    </div>
                    <div className="mt-2">
                      {owned ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-300">
                          <IconCheck size={12} /> Активно
                        </span>
                      ) : blocked ? (
                        <span className="text-[11px] text-slate-500">{d.preOnly ? "Только до выхода" : d.longOnly ? "Только длинные" : "Только Shorts"}</span>
                      ) : (
                        <Button size="sm" variant="ghost" className="w-full" disabled={state.balance < cost} onClick={() => buyBoost(v.id, k)}>
                          {cost === 0 ? "Бесплатно" : money(cost)}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {!inProd && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <IconAnalytics size={18} className="text-sky-400" />
              <h2 className="font-black text-white">Источники трафика</h2>
            </div>
            {[
              ["Рекомендации и поиск", organicViews, "from-sky-500 to-violet-400"],
              ["Платная реклама", v.adViews, "from-amber-500 to-yellow-300"],
            ].map(([l, n, c]) => (
              <div key={l as string} className="mb-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{l}</span>
                  <span className="font-bold tabular-nums text-white">{fmt(n as number)}</span>
                </div>
                <Progress value={((n as number) / Math.max(1, v.views)) * 100} color={c as string} className="mt-1" />
              </div>
            ))}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-white/[0.03] p-2.5">
                <div className="text-slate-500">Гарантия рекомендаций</div>
                <div className="font-bold text-white">{fmt(v.floor)}</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-2.5">
                <div className="text-slate-500">RPM</div>
                <div className="font-bold text-emerald-300">{money((v.revenue / Math.max(1, v.views)) * 1000)}</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-2.5">
                <div className="text-slate-500">Качество</div>
                <div className="font-bold text-white">{v.quality}/100</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-2.5">
                <div className="text-slate-500">Лайки / дизлайки</div>
                <div className="flex items-center gap-2 font-bold text-white">
                  <IconLike size={12} /> {fmt(v.likes)} <IconDislike size={12} /> {fmt(v.dislikes)}
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <IconComment size={18} className="text-slate-300" />
              <h2 className="font-black text-white">Комментарии</h2>
            </div>
            {v.comments.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">Комментариев пока нет</div>
            ) : (
              <div className="space-y-2.5">
                {v.comments.map((c) => (
                  <div key={c.id} className="flex gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-xs font-bold text-white">
                      {c.author.slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-300">@{c.author}</div>
                      <div className="text-sm text-slate-200">{c.text}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-500">
                        <IconLike size={10} /> {fmt(c.likes)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
