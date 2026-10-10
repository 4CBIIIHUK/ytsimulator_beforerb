"use client";

import React from "react";
import Link from "next/link";
import { useGame } from "@/lib/game-engine/GameContext";
import {
  IconCheck,
  IconSparkles,
  IconChannel,
  IconCreate,
  IconViews,
  IconUpgrade,
  IconTeam,
  IconOffer,
} from "@/components/svg/icons";

export const OnboardingBanner: React.FC = () => {
  const { state, advanceOnboarding } = useGame();
  const { onboardingStep, onboardingCompleted } = state;

  if (onboardingCompleted) {
    return null;
  }

  const steps = [
    {
      num: 1,
      title: "Создать канал",
      desc: "Придумай имя, настрой аватар и баннер в SVG-конструкторе",
      reward: "Открытие разделов",
      href: "/create-channel",
      icon: <IconChannel size={16} />,
    },
    {
      num: 2,
      title: "Снять первое видео",
      desc: "Запусти производство: тема, название, длина",
      reward: "+$50",
      href: "/create",
      icon: <IconCreate size={16} />,
    },
    {
      num: 3,
      title: "Опубликовать видео",
      desc: "Получи первые просмотры и подписчиков",
      reward: "+$100",
      href: "/create",
      icon: <IconViews size={16} />,
    },
    {
      num: 4,
      title: "Купить апгрейд",
      desc: "Улучши микрофон, камеру или монтажный софт",
      reward: "+$100",
      href: "/upgrades",
      icon: <IconUpgrade size={16} />,
    },
    {
      num: 5,
      title: "Нанять сотрудника",
      desc: "Найми сценариста, монтажёра или PR-менеджера",
      reward: "+$200",
      href: "/team",
      icon: <IconTeam size={16} />,
    },
    {
      num: 6,
      title: "Принять рекламный оффер",
      desc: "Заключи контракт со спонсором бренда",
      reward: "+$500",
      href: "/offers",
      icon: <IconOffer size={16} />,
    },
  ];

  const currentStep = steps[onboardingStep - 1] || steps[0];

  return (
    <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-900/40 rounded-xl p-4 mb-6 shadow-xl relative overflow-hidden select-none">
      {/* Background glow accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-black uppercase tracking-wider border border-red-500/30">
              <IconSparkles size={12} />
              Онбординг новичка (Шаг {onboardingStep} из 6)
            </span>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Награда: {currentStep.reward}
            </span>
          </div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span>{currentStep.title}</span>
          </h2>
          <p className="text-sm text-slate-300 mt-0.5">{currentStep.desc}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={currentStep.href}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all shadow-lg shadow-red-900/30"
          >
            {currentStep.icon}
            <span>Перейти к шагу</span>
          </Link>
          <button
            onClick={() => advanceOnboarding(onboardingStep + 1)}
            className="text-xs text-slate-400 hover:text-slate-200 underline decoration-slate-600"
          >
            Пропустить
          </button>
        </div>
      </div>

      {/* Progress step indicators */}
      <div className="grid grid-cols-6 gap-2 mt-4 pt-3 border-t border-slate-800">
        {steps.map((st) => {
          const isDone = st.num < onboardingStep;
          const isCurrent = st.num === onboardingStep;
          return (
            <div
              key={st.num}
              className={`flex items-center gap-1.5 text-xs font-semibold p-1 rounded transition-colors ${
                isDone
                  ? "text-emerald-400"
                  : isCurrent
                  ? "text-red-400 bg-red-950/30"
                  : "text-slate-500"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isDone
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : isCurrent
                    ? "bg-red-500 text-white"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {isDone ? <IconCheck size={10} /> : st.num}
              </div>
              <span className="hidden sm:inline truncate">{st.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
