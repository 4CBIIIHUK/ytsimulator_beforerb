"use client";

import React from "react";
import { useGame } from "@/lib/game-engine/GameContext";
import {
  IconTeam,
  IconDollar,
  IconCheck,
  IconTextTool,
  IconSoftware,
  IconAvatarEditor,
  IconHandshake,
  IconMic,
  IconCross,
} from "@/components/svg/icons";

export default function TeamPage() {
  const { state, hireTeamMember, fireTeamMember } = useGame();
  const { team, balance } = state;

  const renderRoleIcon = (role: string) => {
    switch (role) {
      case "scriptwriter":
        return <IconTextTool size={22} />;
      case "editor":
        return <IconSoftware size={22} />;
      case "designer":
        return <IconAvatarEditor size={22} />;
      case "manager":
        return <IconHandshake size={22} />;
      case "sound":
        return <IconMic size={22} />;
      default:
        return <IconTeam size={22} />;
    }
  };

  const totalSalaries = team
    .filter((t) => t.hired)
    .reduce((acc, t) => acc + t.salaryPerMin, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-2 border border-red-500/30">
              <IconTeam size={14} />
              Кадры и Агентство
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Команда продакшна
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Делегируйте рутину специалистам! Сценаристы, монтажеры и дизайнеры повышают CTR и виральность видео.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center gap-4">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Расход на зарплаты</div>
              <div className="text-sm font-black text-red-400">
                ${totalSalaries}/мин
              </div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">В штате</div>
              <div className="text-sm font-black text-white">
                {team.filter((t) => t.hired).length} из {team.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map((member) => {
          const canAfford = balance >= member.hireCost && !member.hired;

          return (
            <div
              key={member.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                member.hired
                  ? "border-emerald-500/40 shadow-emerald-950/20"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`p-3 rounded-xl border ${
                      member.hired
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    {renderRoleIcon(member.role)}
                  </div>
                  <div>
                    {member.hired ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        В штате
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        Свободен
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-0.5">{member.name}</h3>
                <div className="text-xs text-slate-400 font-semibold mb-3">
                  Роль: <span className="text-slate-200">{member.role}</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 mb-4 text-xs text-emerald-400 font-medium">
                  {member.bonusDesc}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Зарплата:</span>
                  <span className="font-mono font-bold text-white">${member.salaryPerMin}/мин</span>
                </div>

                {member.hired ? (
                  <button
                    onClick={() => fireTeamMember(member.id)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-red-950/50 hover:text-red-400 text-slate-400 border border-slate-700 flex items-center justify-center gap-2 transition-all"
                  >
                    <IconCross size={14} />
                    <span>Уволить сотрудника</span>
                  </button>
                ) : (
                  <button
                    onClick={() => hireTeamMember(member.id)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      canAfford
                        ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/30"
                        : "bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed"
                    }`}
                  >
                    <IconDollar size={16} />
                    <span>Нанять за ${member.hireCost}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
