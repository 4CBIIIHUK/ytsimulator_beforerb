"use client";

import React, { useState } from "react";
import { useGame } from "@/lib/game-engine/GameContext";
import {
  IconSettings,
  IconSoundOn,
  IconSoundOff,
  IconCheck,
  IconDollar,
  IconSparkles,
} from "@/components/svg/icons";

export default function SettingsPage() {
  const { state, toggleSound, resetGame, addBalance } = useGame();
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleManualSave = async () => {
    try {
      setSaveStatus("Сохранение в базу данных...");
      const res = await fetch("/api/game/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: "default_player",
          ...state,
        }),
      });
      if (res.ok) {
        setSaveStatus("Прогресс успешно сохранен на сервере!");
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus("Ошибка сервера при сохранении");
      }
    } catch {
      setSaveStatus("Ошибка сети");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider mb-2 border border-slate-700">
          <IconSettings size={14} />
          Параметры и Управление
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Настройки Симулятора
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Управление звуком, сохранениями и профилем блогера.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        {/* Sound toggle */}
        <div className="flex items-center justify-between py-3 border-b border-slate-800">
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              {state.settings.soundEnabled ? <IconSoundOn size={18} /> : <IconSoundOff size={18} />}
              <span>Звуковые эффекты (Web Audio)</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Синтезированные аудио-отклики кликов, монет, успеха и тревоги
            </div>
          </div>

          <button
            onClick={toggleSound}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
              state.settings.soundEnabled
                ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                : "bg-slate-950 border-slate-800 text-slate-500"
            }`}
          >
            {state.settings.soundEnabled ? "Включен" : "Отключен"}
          </button>
        </div>

        {/* Cloud Save */}
        <div className="flex items-center justify-between py-3 border-b border-slate-800">
          <div>
            <div className="text-sm font-bold text-white">Синхронизация с сервером (PostgreSQL)</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Автосохранение каждые 30 секунд. Вы также можете сохранить вручную.
            </div>
            {saveStatus && (
              <div className="text-xs text-emerald-400 font-bold mt-1">{saveStatus}</div>
            )}
          </div>

          <button
            onClick={handleManualSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
          >
            <IconCheck size={14} />
            <span>Сохранить сейчас</span>
          </button>
        </div>

        {/* Sandbox Cheats for Testing / Evaluation */}
        <div className="flex items-center justify-between py-3 border-b border-slate-800">
          <div>
            <div className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
              <IconSparkles size={16} />
              <span>Песочница тестирования (+Баланс)</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Быстро добавить $1,000 для ускоренной проверки механик и покупки апгрейдов
            </div>
          </div>

          <button
            onClick={() => addBalance(1000)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all"
          >
            <IconDollar size={14} />
            <span>+$1,000</span>
          </button>
        </div>

        {/* Reset Game */}
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="text-sm font-bold text-red-400">Сброс прогресса и перезапуск</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Сбрасывает текущий канал, баланс до $500 и онбординг к стартовому состоянию
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm("Вы уверены, что хотите сбросить весь игровой процесс?")) {
                resetGame();
              }
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-500/30 transition-all"
          >
            Сбросить игру
          </button>
        </div>
      </div>
    </div>
  );
}
