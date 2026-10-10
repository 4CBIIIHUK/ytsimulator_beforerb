"use client";

import React, { useMemo } from "react";
import { useGame } from "@/lib/game-engine/GameContext";
import { INITIAL_LEADERBOARD } from "@/lib/game-engine/constants";
import {
  IconTrophy,
  IconPlayButton,
  IconSubscribers,
  IconViews,
  IconCheck,
  IconLock,
} from "@/components/svg/icons";

export default function LeaderboardsPage() {
  const { state } = useGame();
  const { channel, stats } = state;

  // Insert player into leaderboard based on subs
  const leaderboard = useMemo(() => {
    const list = [...INITIAL_LEADERBOARD];
    if (channel) {
      list.push({
        id: "player_channel",
        rank: 999,
        channelName: `${channel.name} (Вы)`,
        subscribers: Math.floor(stats.subscribers),
        views: Math.floor(stats.totalViews),
        category: channel.topic,
        isPlayer: true,
        brandScore: channel.brandScore,
        playButton:
          stats.subscribers >= 1_000_000_000
            ? "googol"
            : stats.subscribers >= 100_000_000
            ? "ruby"
            : stats.subscribers >= 10_000_000
            ? "diamond"
            : stats.subscribers >= 1_000_000
            ? "gold"
            : stats.subscribers >= 100_000
            ? "silver"
            : undefined,
      });
    }

    list.sort((a, b) => b.subscribers - a.subscribers);
    return list.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [channel, stats.subscribers, stats.totalViews]);

  const playButtons = [
    {
      tier: "silver" as const,
      name: "Серебряная кнопка",
      subsReq: 100_000,
      desc: "Первый рубеж признания алгоритмов и преданного комьюнити",
    },
    {
      tier: "gold" as const,
      name: "Золотая кнопка",
      subsReq: 1_000_000,
      desc: "Статус миллионника и топ-создателя платформы",
    },
    {
      tier: "diamond" as const,
      name: "Бриллиантовая кнопка",
      subsReq: 10_000_000,
      desc: "Элита мирового видеохостинга",
    },
    {
      tier: "ruby" as const,
      name: "Рубиновая / Red Diamond",
      subsReq: 100_000_000,
      desc: "Глобальное доминирование в медиа-пространстве",
    },
    {
      tier: "googol" as const,
      name: "Googol Кнопка (Сверхфинал)",
      subsReq: 1_000_000_000,
      desc: "Абсолютная сингулярность медиа. Один миллиард зрителей!",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
          <IconTrophy size={14} />
          Глобальный рейтинг каналов
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Лидерборд и Наградные Кнопки
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Соревнуйтесь с легендарными медиа-империями. Достигните миллиарда подписчиков для Googol-эндинга!
        </p>
      </div>

      {/* Play Buttons Shelf Showcase */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-base font-black text-white mb-4 flex items-center gap-2">
          <IconTrophy size={18} className="text-amber-400" />
          <span>Полка наградных кнопок</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {playButtons.map((btn) => {
            const unlocked = stats.subscribers >= btn.subsReq;

            return (
              <div
                key={btn.tier}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  unlocked
                    ? "bg-slate-950 border-amber-500/50 shadow-lg shadow-amber-950/20"
                    : "bg-slate-950/40 border-slate-800 opacity-60"
                }`}
              >
                <div>
                  <div className="flex justify-center mb-3">
                    <IconPlayButton tier={btn.tier} size={48} />
                  </div>
                  <h3 className="text-xs font-black text-white text-center mb-1">{btn.name}</h3>
                  <div className="text-[11px] font-mono text-center text-amber-400 font-bold mb-2">
                    {btn.subsReq.toLocaleString()} subs
                  </div>
                  <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    {btn.desc}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 text-center">
                  {unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <IconCheck size={12} /> Получено
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500">
                      <IconLock size={12} /> {Math.floor(stats.subscribers).toLocaleString()} / {btn.subsReq.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-black text-white">Топ-10 мировых каналов</h2>
          <span className="text-xs text-slate-400 font-semibold">
            Ваш текущий ранг: #{leaderboard.find((l) => l.isPlayer)?.rank || "1000+"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Ранг</th>
                <th className="py-3 px-4">Канал</th>
                <th className="py-3 px-4">Категория</th>
                <th className="py-3 px-4">Подписчики</th>
                <th className="py-3 px-4">Просмотры</th>
                <th className="py-3 px-4">Кнопка</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {leaderboard.map((user) => (
                <tr
                  key={user.id}
                  className={`transition-colors ${
                    user.isPlayer
                      ? "bg-red-950/40 border-l-4 border-red-500 font-bold text-white"
                      : "text-slate-300 hover:bg-slate-850"
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span
                      className={`inline-block w-6 text-center ${
                        user.rank === 1
                          ? "text-amber-400 font-black text-sm"
                          : user.rank === 2
                          ? "text-slate-300 font-black text-sm"
                          : user.rank === 3
                          ? "text-amber-600 font-black text-sm"
                          : "text-slate-500"
                      }`}
                    >
                      #{user.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold">
                    <div className="flex items-center gap-2">
                      <span>{user.channelName}</span>
                      {user.isPlayer && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-600 text-white uppercase font-bold">
                          ВЫ
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{user.category}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white flex items-center gap-1.5">
                    <IconSubscribers size={14} className="text-red-400" />
                    {user.subscribers.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {user.views.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    {user.playButton ? (
                      <IconPlayButton tier={user.playButton} size={22} />
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
