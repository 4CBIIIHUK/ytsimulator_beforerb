"use client";

import React, { useState } from "react";
import { useGame } from "@/lib/game-engine/GameContext";
import { UPGRADES, UPGRADE_CATEGORIES, STAT_LABELS, upgradeMult, upgradeCost, upgradeTierName } from "@/lib/game-engine/upgrades";
import { productionMs } from "@/lib/game-engine/engine";
import { Card, PageHeader, Button, Badge, Progress, GameIcon, cn } from "@/components/ui";
import { IconUpgrade, IconArrowUp, IconCheck } from "@/components/svg/icons";
import { money, mult } from "@/lib/format";
import { StatKey } from "@/types/game";

const SUMMARY: { key: StatKey | "brand" | "meta"; label: string }[] = [
  { key: "reach", label: "Охват" },
  { key: "ctr", label: "CTR" },
  { key: "retention", label: "Удержание" },
  { key: "shorts", label: "Shorts" },
  { key: "longform", label: "Длинные" },
  { key: "subs", label: "Подписки" },
  { key: "cpm", label: "RPM" },
  { key: "trend", label: "Тренды" },
  { key: "ads", label: "Реклама" },
  { key: "tail", label: "Хвост" },
  { key: "sponsor", label: "Спонсоры" },
  { key: "brand", label: "Оформление" },
  { key: "meta", label: "Мета-бонус" },
];

export default function UpgradesPage() {
  const { state, mods, buyUpgrade, buyUpgradeMax } = useGame();
  const [cat, setCat] = useState<string>("all");
  const list = UPGRADES.filter((u) => cat === "all" || u.category === cat);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <PageHeader
        icon={<IconUpgrade size={13} />}
        kicker="Множители роста"
        title="Апгрейды"
        desc="Каждый уровень умножает показатель. Множители разных апгрейдов перемножаются между собой — охват растёт экспоненциально."
        right={
          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Видео готовится</div>
            <div className="text-lg font-black text-white">{(productionMs(mods) / 1000).toFixed(1)} сек</div>
            <div className="text-[10px] text-slate-500">Слотов производства: {mods.slots}</div>
          </div>
        }
      />

      <Card className="p-4">
        <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Итоговые множители канала</div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7 xl:grid-cols-13">
          {SUMMARY.map((s) => {
            const v = (mods as unknown as Record<string, number>)[s.key];
            return (
              <div key={s.key} className="rounded-xl border border-white/[0.06] bg-black/25 px-2.5 py-2">
                <div className="text-[10px] text-slate-500">{s.label}</div>
                <div className={cn("text-sm font-black tabular-nums", v > 1 ? "text-emerald-300" : v < 1 ? "text-red-300" : "text-slate-300")}>{mult(v)}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {[{ id: "all", label: "Все" }, ...UPGRADE_CATEGORIES].map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={cn(
              "whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all",
              cat === c.id ? "bg-white text-slate-900" : "border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((u) => {
          const lvl = state.upgrades[u.id] || 0;
          const max = lvl >= u.levels;
          const cost = upgradeCost(u, lvl);
          const cur = upgradeMult(u, lvl);
          const next = upgradeMult(u, lvl + 1);
          const can = !max && state.balance >= cost;
          return (
            <Card key={u.id} className="flex flex-col p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-red-500/20 to-transparent text-red-300">
                  <GameIcon name={u.icon} size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate font-bold text-white">{u.name}</h3>
                    <Badge>
                      {lvl}/{u.levels}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-400">
                    Сейчас: <span className="font-semibold text-slate-200">{upgradeTierName(u, lvl)}</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500">{u.description}</p>

              <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/25 p-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{STAT_LABELS[u.stat]}</span>
                  <span>макс. {mult(u.maxMult)}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xl font-black tabular-nums text-white">{mult(cur)}</span>
                  {!max && (
                    <>
                      <IconArrowUp size={14} className="rotate-90 text-slate-600" />
                      <span className="text-xl font-black tabular-nums text-emerald-400">{mult(next)}</span>
                    </>
                  )}
                </div>
                <Progress value={(lvl / u.levels) * 100} className="mt-2" />
              </div>

              <div className="mt-3 flex gap-2">
                <Button className="flex-1" disabled={!can} onClick={() => buyUpgrade(u.id)}>
                  {max ? (
                    <>
                      <IconCheck size={15} /> Максимум
                    </>
                  ) : (
                    <>Улучшить · {money(cost)}</>
                  )}
                </Button>
                {!max && (
                  <Button variant="ghost" disabled={!can} onClick={() => buyUpgradeMax(u.id)}>
                    Макс
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
