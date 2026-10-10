"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGame } from "@/lib/game-engine/GameContext";
import {
  IconNetwork,
  IconLock,
  IconDollar,
  IconCheck,
  IconBuyout,
  IconSparkles,
} from "@/components/svg/icons";

interface NetworkSlot {
  id: string;
  name: string;
  niche: string;
  dailyRev: number;
  cost: number;
}

const NETWORK_SLOTS: NetworkSlot[] = [
  { id: "net_1", name: "CyberGamer Network MCN", niche: "Игры & Киберспорт", dailyRev: 2500, cost: 50000 },
  { id: "net_2", name: "Apex Tech & Science Syndicate", niche: "Наука и Технологии", dailyRev: 4800, cost: 120000 },
  { id: "net_3", name: "Hyperion Music & Beats Label", niche: "Музыка & Саундтреки", dailyRev: 8500, cost: 300000 },
  { id: "net_4", name: "Omni Kids & Animation Universe", niche: "Анимация & Дети", dailyRev: 22000, cost: 1000000 },
];

export default function NetworksPage() {
  const { state, addBalance } = useGame();
  const { stats, balance } = state;
  const soldCount = stats.soldChannelsCount;
  const isUnlocked = soldCount >= 10;

  const [acquired, setAcquired] = useState<Record<string, boolean>>({});

  const handleAcquire = (slot: NetworkSlot) => {
    if (balance >= slot.cost && !acquired[slot.id]) {
      addBalance(-slot.cost);
      setAcquired((prev) => ({ ...prev, [slot.id]: true }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2 border border-purple-500/30">
          <IconNetwork size={14} />
          Мультиканальные сети (MCN Tycoon)
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Сети Каналов и Медиахолдинг
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Мета-прогресс для опытных продюсеров. Требуется провести 10 успешных продаж каналов
          (перерождений).
        </p>
      </div>

      {!isUnlocked ? (
        /* Locked State */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
            <IconLock size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">Раздел закрыт инспекцией M&A</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Чтобы зарегистрировать собственную сеть каналов (MCN) и нанимать сторонних блогеров,
              необходимо продать <span className="text-white font-bold">10 каналов</span> инвесторам.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400">Прогресс продаж каналов:</span>
              <span className="text-purple-400">{soldCount} из 10</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (soldCount / 10) * 100)}%` }}
              />
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/channel/sell"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-950/40"
            >
              <IconBuyout size={16} />
              <span>Перейти к рынку выкупа каналов</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Unlocked MCN Tycoon */
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/40 rounded-2xl p-4 flex items-center gap-3 text-purple-200 text-xs">
            <IconSparkles size={18} className="text-purple-400 shrink-0" />
            <span>
              Поздравляем! Вы опытный медиамагнат. Вы можете приобретать контрольные доли в дочерних сетях
              для масштабного пассивного притока капитала!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NETWORK_SLOTS.map((slot) => {
              const hasIt = Boolean(acquired[slot.id]);
              const canAfford = balance >= slot.cost;

              return (
                <div
                  key={slot.id}
                  className={`bg-slate-900 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                    hasIt ? "border-purple-500/60" : "border-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                        {slot.niche}
                      </span>
                      {hasIt && (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <IconCheck size={12} /> В холдинге
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{slot.name}</h3>
                    <div className="text-xs text-slate-400">
                      Пассивный доход сети:{" "}
                      <span className="text-emerald-400 font-bold">+${slot.dailyRev}/день</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 mt-4">
                    {hasIt ? (
                      <div className="py-2.5 text-center text-xs font-bold text-purple-400 bg-purple-950/30 rounded-xl border border-purple-500/30">
                        Сеть активно генерирует прибыль
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAcquire(slot)}
                        disabled={!canAfford}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                          canAfford
                            ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/30"
                            : "bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed"
                        }`}
                      >
                        <IconDollar size={16} />
                        <span>Выкупить долю за ${slot.cost.toLocaleString()}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
