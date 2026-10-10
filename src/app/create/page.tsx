"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/game-engine/GameContext";
import { CHANNEL_TOPICS } from "@/lib/game-engine/constants";
import { estimatePotential, lengthFactor, productionMs, activeProductions } from "@/lib/game-engine/engine";
import { Card, PageHeader, Button, Badge, cn } from "@/components/ui";
import { ThumbnailRenderer } from "@/components/game/ThumbnailRenderer";
import { IconCreate, IconPlay, IconShorts, IconSparkles, IconFlame, IconClock, IconCheck, IconInfo } from "@/components/svg/icons";
import { fmt, mult, duration as fmtDur } from "@/lib/format";

const STYLES = [
  { id: "neon-bold", label: "Неон и крупный текст" },
  { id: "reaction-face", label: "Эмоция и шок" },
  { id: "minimal-clean", label: "Премиум минимализм" },
  { id: "clickbait-arrow", label: "Стрелка и тайна" },
];

export default function CreatePage() {
  const router = useRouter();
  const { state, mods, startProduction } = useGame();
  const { channel } = state;
  const [type, setType] = useState<"video" | "shorts">("video");
  const [topic, setTopic] = useState<string>(channel?.topic || "Игры");
  const [title, setTitle] = useState("");
  const [thumbText, setThumbText] = useState("");
  const [style, setStyle] = useState("neon-bold");
  const [dur, setDur] = useState(1500);
  const [err, setErr] = useState<string | null>(null);

  const est = useMemo(() => estimatePotential(state, type, dur, topic), [state, type, dur, topic]);
  const busy = activeProductions(state).length;

  if (!channel) {
    return (
      <Card className="mx-auto mt-10 max-w-md p-8 text-center">
        <h2 className="text-xl font-black text-white">Сначала создайте канал</h2>
        <p className="mt-2 text-sm text-slate-400">Без канала нельзя публиковать видео.</p>
        <Link href="/create-channel" className="mt-5 inline-flex rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white">
          Создать канал
        </Link>
      </Card>
    );
  }

  const switchType = (t: "video" | "shorts") => {
    setType(t);
    setDur(t === "shorts" ? 30 : 1500);
  };

  const suggest = () => {
    const pool = [
      `Я провёл 24 часа в теме «${topic}»`,
      `Вся правда про ${topic.toLowerCase()}, о которой молчат`,
      `Топ-5 ошибок новичка: ${topic.toLowerCase()}`,
      `Потратил $10 000 на ${topic.toLowerCase()} — стоило ли?`,
      `${topic}: это изменит всё`,
    ];
    const trend = est.trend.trend;
    const t = trend && Math.random() < 0.6 ? `${trend.topic}: мой эксперимент` : pool[Math.floor(Math.random() * pool.length)];
    setTitle(t);
    setThumbText(t.split(" ").slice(0, 3).join(" "));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const r = startProduction({ title, thumbnailText: thumbText || title, topic, type, duration: dur, thumbnailStyle: style });
    if (r.ok && r.videoId) router.push(`/studio/${r.videoId}`);
    else setErr(r.error || "Ошибка");
  };

  const floorText = type === "shorts" ? (est.good ? "≈5K+" : "≈1K+") : est.good ? "≈200+" : "≈40+";
  const expected = Math.max(est.raw, est.floorNominal);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <PageHeader
        icon={<IconCreate size={13} />}
        kicker="Производство"
        title="Новое видео"
        desc="После запуска видео ~20 секунд монтируется и загружается. В это время в Студии можно купить рекламу на старт, превью и другие бусты."
        right={
          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Слоты производства</div>
            <div className="text-lg font-black text-white">
              {busy}/{mods.slots}
            </div>
            <div className="text-[10px] text-slate-500">Готовность: {(productionMs(mods) / 1000).toFixed(1)} сек</div>
          </div>
        }
      />

      <form onSubmit={submit} className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <Card className="p-5">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Формат</div>
            <div className="grid grid-cols-2 gap-3">
              {(["video", "shorts"] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => switchType(t)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all",
                    type === t ? "border-red-500/60 bg-red-500/10" : "border-white/[0.07] bg-black/20 hover:bg-white/[0.04]"
                  )}
                >
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg", type === t ? "bg-red-500 text-white" : "bg-white/5 text-slate-400")}>
                    {t === "video" ? <IconPlay size={18} /> : <IconShorts size={18} />}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-white">{t === "video" ? "Длинное видео" : "Shorts"}</span>
                    <span className="block text-[11px] text-slate-500">{t === "video" ? "Высокий RPM, больше подписок" : "Огромный охват, низкий RPM"}</span>
                  </span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Тема</span>
              <span className="text-[11px] text-slate-500">Ниша канала: {channel.topic} (+15% к охвату)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {CHANNEL_TOPICS.map((t) => {
                const tr = state.trends.filter((x) => x.category === t).sort((a, b) => b.hype - a.hype)[0];
                const trMult = tr ? 1 + (tr.baseViewsMult - 1) * (tr.hype / 100) * mods.trend : 1;
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTopic(t)}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-left transition-all",
                      topic === t ? "border-red-500/60 bg-red-500/10 text-white" : "border-white/[0.07] bg-black/20 text-slate-400 hover:text-white"
                    )}
                  >
                    <div className="text-xs font-bold">{t}</div>
                    {tr ? (
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-amber-300">
                        <IconFlame size={10} /> {mult(trMult)}
                      </div>
                    ) : (
                      <div className="mt-1 text-[10px] text-slate-600">нет тренда</div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Название и превью</span>
              <button type="button" onClick={suggest} className="flex items-center gap-1 text-xs font-bold text-red-300 hover:text-red-200">
                <IconSparkles size={13} /> Сгенерировать
              </button>
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              placeholder="Название видео"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-medium text-white outline-none focus:border-red-500/60"
            />
            <input
              value={thumbText}
              onChange={(e) => setThumbText(e.target.value)}
              maxLength={24}
              placeholder="Текст на превью (до 24 символов)"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/60"
            />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STYLES.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={cn("overflow-hidden rounded-xl border text-left transition-all", style === s.id ? "border-red-500/70 ring-2 ring-red-500/30" : "border-white/[0.07]")}
                >
                  <div className="aspect-video">
                    <ThumbnailRenderer text={thumbText || "ПРЕВЬЮ"} topic={topic} style={s.id} tier={2} type="video" />
                  </div>
                  <div className="bg-black/40 px-2 py-1.5 text-[10px] font-bold text-slate-300">{s.label}</div>
                </button>
              ))}
            </div>
            <p className="flex items-start gap-1.5 text-[11px] text-slate-500">
              <IconInfo size={13} className="mt-0.5 shrink-0" /> Стартовое превью — бесплатный скриншот. Профессиональные превью покупаются в Студии и поднимают CTR до x3.8.
            </p>
          </Card>

          <Card className="p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                <IconClock size={13} /> Длина
              </span>
              <span className="flex items-center gap-2">
                {est.good ? <Badge color="emerald">Хорошая длина</Badge> : <Badge color="amber">Неоптимально</Badge>}
                <span className="font-mono text-sm font-bold text-white">{fmtDur(dur)}</span>
              </span>
            </div>
            <input
              type="range"
              min={type === "shorts" ? 10 : 120}
              max={type === "shorts" ? 60 : 4800}
              step={type === "shorts" ? 1 : 60}
              value={dur}
              onChange={(e) => setDur(Number(e.target.value))}
              className="w-full accent-red-500"
            />
            <div className="mt-2 text-[11px] text-slate-500">
              {type === "shorts"
                ? "Shorts: 20–45 сек — идеальная длина, рекомендации почти гарантируют 5K+. Иначе минимум около 1K."
                : "Длинные: от 20 минут — алгоритм гарантирует от 200 просмотров. От 8 минут включаются мид-роллы (RPM x1.6)."}
            </div>
          </Card>
        </div>

        <div className="space-y-4 lg:sticky lg:top-0 lg:self-start">
          <Card className="overflow-hidden" glow="red">
            <div className={type === "shorts" ? "mx-auto aspect-[9/16] max-h-[340px]" : "aspect-video"}>
              <ThumbnailRenderer text={thumbText || title || "НОВОЕ ВИДЕО"} topic={topic} style={style} tier={0} type={type} />
            </div>
            <div className="space-y-3 p-4">
              <div className="line-clamp-2 font-bold text-white">{title || "Без названия"}</div>
              <div className="rounded-xl border border-white/[0.06] bg-black/30 p-3">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Прогноз просмотров (без бустов)</div>
                <div className="mt-1 text-2xl font-black tabular-nums text-white">~{fmt(expected)}</div>
                <div className="text-[11px] text-slate-500">Гарантированный минимум рекомендаций: {floorText}</div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                {[
                  ["Оформление канала", mods.brand],
                  ["Тренд", est.trend.mult],
                  ["Длина", lengthFactor(type, dur)],
                  ["Ниша", channel.topic === topic ? 1.15 : 0.9],
                  ["Охват (апгрейды)", mods.reach],
                  ["Формат", type === "shorts" ? mods.shorts : mods.longform],
                  ["CTR", mods.ctr],
                  ["Мета-бонус", mods.meta],
                ].map(([l, v]) => (
                  <div key={l as string} className="flex justify-between rounded-lg bg-white/[0.03] px-2 py-1.5">
                    <span className="text-slate-500">{l}</span>
                    <span className={cn("font-bold tabular-nums", (v as number) >= 1 ? "text-emerald-300" : "text-red-300")}>{mult(v as number)}</span>
                  </div>
                ))}
              </div>
              {err && <div className="rounded-lg border border-red-500/30 bg-red-950/40 p-2 text-xs text-red-200">{err}</div>}
              <Button type="submit" size="lg" className="w-full" disabled={!title.trim() || busy >= mods.slots}>
                <IconCheck size={16} /> {busy >= mods.slots ? "Слоты заняты" : "Запустить производство"}
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
