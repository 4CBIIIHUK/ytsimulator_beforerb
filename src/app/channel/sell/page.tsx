"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useGame } from "@/lib/game-engine/GameContext";
import {
  IconBuyout,
  IconCheck,
  IconCross,
  IconNegotiate,
  IconHistory,
  IconClock,
  IconHandshake,
  IconSparkles,
  IconNewChannel,
  IconTrophy,
} from "@/components/svg/icons";
import {
  LogoOmniMedia,
  LogoCyberStream,
  LogoApex,
  LogoHyperion,
  LogoVanguard,
  LogoGoogolSyndicate,
} from "@/components/svg/buyer-logos";

export default function SellChannelPage() {
  const {
    state,
    acceptBuyoutOffer,
    declineBuyoutOffer,
    negotiateBuyoutOffer,
    triggerManualBuyoutOffer,
    activeBuyoutCountdown,
    timeUntilNextBuyoutCheck,
  } = useGame();

  const { channel, activeBuyoutOffer, salesHistory, stats } = state;
  const [negotiateStatus, setNegotiateStatus] = useState<string | null>(null);
  const [saleCelebration, setSaleCelebration] = useState<{ amount: number; buyer: string } | null>(null);

  const hasOffer = activeBuyoutOffer && activeBuyoutOffer.status === "active";
  const subs = stats.subscribers;
  const eligibleForOffers = channel !== null && subs >= 100;

  const handleAccept = () => {
    const result = acceptBuyoutOffer();
    if (result) {
      setSaleCelebration({ amount: result.price, buyer: result.buyerName });
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  const handleNegotiate = () => {
    const res = negotiateBuyoutOffer();
    if (res.walkedAway) {
      setNegotiateStatus("Покупатель счёл ваши требования завышенными и прервал переговоры!");
    } else if (res.success && res.newPrice) {
      setNegotiateStatus(`Переговоры успешны! Новая сумма: $${res.newPrice.toLocaleString()}`);
    }
  };

  const renderBuyerLogo = (logoType?: string) => {
    switch (logoType) {
      case "omni":
        return <LogoOmniMedia size={44} />;
      case "cyber":
        return <LogoCyberStream size={44} />;
      case "apex":
        return <LogoApex size={44} />;
      case "hyperion":
        return <LogoHyperion size={44} />;
      case "vanguard":
        return <LogoVanguard size={44} />;
      case "googol":
        return <LogoGoogolSyndicate size={44} />;
      default:
        return <LogoOmniMedia size={44} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
              <IconBuyout size={14} />
              Рынок M&A и выкуп каналов
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Продажа и Перерождение Канала
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Офферы на выкуп поступают раз в ~3 минуты при наличии от 100 подписчиков. Продажа даёт
              деньги и постоянный мета-бонус +10% к охвату следующих каналов!
            </p>
          </div>

          {/* Meta progress card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 shrink-0">
            <div className="text-xs font-bold text-slate-400">Текущий мета-бонус продаж</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              +{(stats.soldChannelsCount * 10)}% к охвату
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Продано каналов: {stats.soldChannelsCount} (10 для открытия Сетей)
            </div>
          </div>
        </div>
      </div>

      {/* Sale Celebration Modal / Banner if just sold */}
      {saleCelebration && (
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-2 border-emerald-500 rounded-2xl p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center">
            <IconHandshake size={32} />
          </div>
          <h2 className="text-2xl font-black text-white">СДЕЛКА ВЕКА ЗАКЛЮЧЕНА!</h2>
          <p className="text-slate-300 max-w-lg mx-auto text-sm">
            Ваш канал успешно продан холдингу <span className="font-bold text-white">{saleCelebration.buyer}</span> за{" "}
            <span className="font-black text-emerald-400 text-lg">${saleCelebration.amount.toLocaleString()}</span>!
            Деньги зачислены на ваш баланс. Вы получили постоянный бонус к охвату.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/create-channel"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-red-950/40"
            >
              <IconNewChannel size={18} />
              <span>Создать новый канал (с бонусом +{(stats.soldChannelsCount * 10)}%)</span>
            </Link>
            <button
              onClick={() => setSaleCelebration(null)}
              className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-sm font-bold border border-slate-700"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Active Buyout Offer Card */}
      {hasOffer ? (
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/70 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {/* Top banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 shadow-md">
                {renderBuyerLogo(activeBuyoutOffer.buyerLogo)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    Официальный оффер M&A
                  </span>
                  <span className="text-xs text-slate-400">Медиахолдинг</span>
                </div>
                <h3 className="text-xl font-black text-white mt-0.5">
                  {activeBuyoutOffer.buyerName}
                </h3>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/40 px-3.5 py-2 rounded-xl text-red-400">
              <IconClock size={18} className="animate-spin" />
              <div>
                <div className="text-[10px] uppercase font-bold text-red-300">Срок действия</div>
                <div className="text-sm font-black font-mono">{activeBuyoutCountdown} секунд</div>
              </div>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-semibold uppercase">Сумма выкупа</div>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                ${activeBuyoutOffer.currentOfferPrice.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Базовая оценка: ${Math.round(activeBuyoutOffer.basePrice).toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-semibold uppercase">Условия сделки</div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {activeBuyoutOffer.conditionText}
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-semibold uppercase">Метрики при сделке</div>
              <div className="text-xs text-slate-300 mt-1.5 space-y-1">
                <div>Подписчики: <span className="font-bold text-white">{Math.floor(stats.subscribers).toLocaleString()}</span></div>
                <div>Просмотры: <span className="font-bold text-white">{Math.floor(stats.totalViews).toLocaleString()}</span></div>
                <div>Brand Score: <span className="font-bold text-amber-400">{channel?.brandScore || 0}/100</span></div>
              </div>
            </div>
          </div>

          {negotiateStatus && (
            <div className="mb-6 p-3 bg-slate-950 border border-amber-500/40 text-amber-300 text-xs rounded-xl">
              {negotiateStatus}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleAccept}
              className="flex-1 min-w-[160px] flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
            >
              <IconCheck size={20} />
              <span>Принять сделку (${activeBuyoutOffer.currentOfferPrice.toLocaleString()})</span>
            </button>

            <button
              onClick={handleNegotiate}
              disabled={activeBuyoutOffer.negotiatedCount >= 2}
              className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-sm transition-all disabled:opacity-40"
            >
              <IconNegotiate size={18} />
              <span>Поторговаться (±20%, риск 30%)</span>
            </button>

            <button
              onClick={declineBuyoutOffer}
              className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-sm transition-all"
            >
              <IconCross size={18} />
              <span>Отклонить</span>
            </button>
          </div>
        </div>
      ) : (
        /* Waiting / Idle State */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <IconClock size={32} />
          </div>
          <h3 className="text-xl font-black text-white">
            {channel ? "Ожидание предложений от покупателей..." : "У вас нет активного канала"}
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {channel ? (
              subs < 100 ? (
                <span className="text-amber-400">
                  Покупателям интересен канал минимум с 100 подписчиками (сейчас: {Math.floor(subs)}/100).
                  Создавайте видео и набирайте аудиторию!
                </span>
              ) : (
                `Инвесторы и холдинги оценивают ваши показатели. Оффер прилетает раз в ~3 минуты (следующая проверка через ${timeUntilNextBuyoutCheck} сек).`
              )
            ) : (
              "Создайте новый канал, чтобы начать привлекать зрителей и предложения о выкупе."
            )}
          </p>

          <div className="flex justify-center gap-3 pt-2">
            {!channel ? (
              <Link
                href="/create-channel"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm"
              >
                <IconNewChannel size={18} />
                <span>Создать канал</span>
              </Link>
            ) : eligibleForOffers ? (
              <button
                onClick={triggerManualBuyoutOffer}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
              >
                <IconSparkles size={16} />
                <span>Запросить срочную оценку брокера</span>
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Sales History Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconHistory size={20} className="text-slate-400" />
            <h3 className="text-lg font-black text-white">История продаж каналов</h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            Всего продано: {salesHistory.length}
          </span>
        </div>

        {salesHistory.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            Вы ещё не продали ни одного канала. Заключите первую сделку, чтобы открыть перерождение!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Канал</th>
                  <th className="py-3 px-4">Покупатель</th>
                  <th className="py-3 px-4">Сумма сделки</th>
                  <th className="py-3 px-4">Подписчики</th>
                  <th className="py-3 px-4">Просмотры</th>
                  <th className="py-3 px-4">Brand Score</th>
                  <th className="py-3 px-4">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {salesHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-bold text-white">{item.channelName}</td>
                    <td className="py-3 px-4 text-slate-300">{item.buyerName}</td>
                    <td className="py-3 px-4 font-black text-emerald-400">
                      ${item.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">{item.subscribers.toLocaleString()}</td>
                    <td className="py-3 px-4">{item.views.toLocaleString()}</td>
                    <td className="py-3 px-4 text-amber-400 font-bold">{item.brandScore}/100</td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(item.soldAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sale Achievements */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <IconTrophy size={20} className="text-amber-400" />
          <h3 className="text-lg font-black text-white">Достижения брокера и инвестора</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              title: "Первая продажа",
              desc: "Продать свой первый канал медиахолдингу",
              done: salesHistory.length >= 1,
            },
            {
              title: "Продажа за $1M",
              desc: "Заключить сделку на сумму более одного миллиона",
              done: salesHistory.some((s) => s.price >= 1_000_000),
            },
            {
              title: "Продажа за $1B",
              desc: "Медиа-сделка эпохи с глобальной корпорацией",
              done: salesHistory.some((s) => s.price >= 1_000_000_000),
            },
            {
              title: "Серийный продавец",
              desc: "Продать 10 каналов и открыть Сети Каналов",
              done: salesHistory.length >= 10,
            },
          ].map((ach, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border transition-all ${
                ach.done
                  ? "bg-amber-950/20 border-amber-500/40 text-amber-200"
                  : "bg-slate-950/60 border-slate-800 text-slate-500"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black uppercase tracking-wider">{ach.title}</span>
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    ach.done ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-600"
                  }`}
                >
                  <IconCheck size={10} />
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">{ach.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
