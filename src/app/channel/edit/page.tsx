"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGame } from "@/lib/game-engine/GameContext";
import { AvatarConfig, BannerConfig } from "@/types/game";
import { calculateBrandScore } from "@/lib/scoring/brand-score";
import { AvatarRenderer } from "@/components/channel-editor/AvatarRenderer";
import { BannerRenderer } from "@/components/channel-editor/BannerRenderer";
import {
  IconAvatarEditor,
  IconBannerEditor,
  IconBrandScore,
  IconCheck,
  IconPalette,
  IconShape,
  IconTextTool,
} from "@/components/svg/icons";

export default function EditChannelPage() {
  const router = useRouter();
  const { state, updateChannelDesign } = useGame();
  const { channel, balance } = state;

  const [avatar, setAvatar] = useState<AvatarConfig>(
    channel?.avatar || {
      shape: "circle",
      bgGradient: "cyberpunk",
      eyes: "normal",
      mouth: "smile",
      brows: "neutral",
      accessory: "headphones",
      monogram: "YT",
      textColor: "#ffffff",
      border: "neon",
      borderColor: "#38bdf8",
    }
  );

  const [banner, setBanner] = useState<BannerConfig>(
    channel?.banner || {
      bgStyle: "cyber-grid",
      colorA: "#3b82f6",
      colorB: "#1d4ed8",
      slogan: "Официальный канал!",
      showMascot: true,
      mascotType: "streamer",
      socials: { youtube: true, twitter: true, discord: true, twitch: false },
    }
  );

  const [description, setDescription] = useState(channel?.description || "");
  const [activeTab, setActiveTab] = useState<"avatar" | "banner" | "desc">("avatar");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!channel) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Сначала необходимо создать канал.</p>
        <Link href="/create-channel" className="text-red-400 font-bold underline mt-2 inline-block">
          Создать канал
        </Link>
      </div>
    );
  }

  const scoreBreakdown = calculateBrandScore(channel.name, channel.topic, description, avatar, banner);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (balance < 50) {
      setErrorMsg("Недостаточно денег ($50) для оплаты услуг ребрендинга и дизайнеров!");
      return;
    }
    const res = updateChannelDesign(avatar, banner, description);
    if (res.success) {
      router.push("/channel");
    } else {
      setErrorMsg(res.error || "Ошибка сохранения");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">Редактор оформления (Ребрендинг)</h1>
            <p className="text-xs text-slate-400 mt-1">
              Стоимость переоформления: <span className="text-emerald-400 font-bold">$50</span>. Обновляет Brand Score и повышает интерес аудитории!
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/40">
              <IconBrandScore size={16} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Новый Brand Score</div>
              <div className="text-sm font-black text-amber-400">{scoreBreakdown.totalBrandScore}/100</div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="mt-6 pt-4 border-t border-slate-800 relative">
          <BannerRenderer config={banner} channelName={channel.name} height="160px" />
          <div className="absolute -bottom-5 left-6 flex items-end gap-3 z-10">
            <div className="p-1 bg-slate-900 rounded-2xl shadow-xl">
              <AvatarRenderer config={avatar} size={70} />
            </div>
          </div>
          <div className="h-6" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab("avatar")}
          className={`px-4 py-2.5 font-bold text-xs border-b-2 flex items-center gap-2 ${
            activeTab === "avatar" ? "border-red-500 text-white" : "border-transparent text-slate-400"
          }`}
        >
          <IconAvatarEditor size={16} />
          <span>Аватар</span>
        </button>
        <button
          onClick={() => setActiveTab("banner")}
          className={`px-4 py-2.5 font-bold text-xs border-b-2 flex items-center gap-2 ${
            activeTab === "banner" ? "border-red-500 text-white" : "border-transparent text-slate-400"
          }`}
        >
          <IconBannerEditor size={16} />
          <span>Баннер</span>
        </button>
        <button
          onClick={() => setActiveTab("desc")}
          className={`px-4 py-2.5 font-bold text-xs border-b-2 flex items-center gap-2 ${
            activeTab === "desc" ? "border-red-500 text-white" : "border-transparent text-slate-400"
          }`}
        >
          <IconTextTool size={16} />
          <span>Описание</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Controls */}
      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === "avatar" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2 flex items-center gap-1.5">
                <IconShape size={14} /> Форма
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["circle", "rounded", "square", "hexagon"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setAvatar({ ...avatar, shape: s })}
                    className={`py-2 text-xs font-bold rounded-lg border ${
                      avatar.shape === s ? "bg-red-600 text-white border-red-500" : "bg-slate-950 border-slate-700 text-slate-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2 flex items-center gap-1.5">
                <IconPalette size={14} /> Фон
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {["cyberpunk", "sunset", "neon-matrix", "gold-rush", "crimson", "amethyst", "midnight"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setAvatar({ ...avatar, bgGradient: g })}
                    className={`p-2 text-[10px] font-bold rounded-lg border ${
                      avatar.bgGradient === g ? "bg-red-600 text-white border-red-500" : "bg-slate-950 border-slate-700 text-slate-400"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Глаза</label>
                <select
                  value={avatar.eyes}
                  onChange={(e) => setAvatar({ ...avatar, eyes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                >
                  <option value="normal">Обычные</option>
                  <option value="wink">Подмигивание</option>
                  <option value="cool">Очки</option>
                  <option value="happy">Радостные</option>
                  <option value="glow">Кибер-сканер</option>
                  <option value="stars">Звезды</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Рот</label>
                <select
                  value={avatar.mouth}
                  onChange={(e) => setAvatar({ ...avatar, mouth: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                >
                  <option value="smile">Улыбка</option>
                  <option value="open">Смех</option>
                  <option value="smirk">Ухмылка</option>
                  <option value="gamer">Геймер</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "banner" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Стиль баннера</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {["cyber-grid", "synthwave", "studio-waves", "dots-matrix", "minimal-geo"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setBanner({ ...banner, bgStyle: st })}
                    className={`py-2 text-xs font-bold rounded-lg border ${
                      banner.bgStyle === st ? "bg-red-600 text-white border-red-500" : "bg-slate-950 border-slate-700 text-slate-300"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Слоган</label>
              <input
                type="text"
                value={banner.slogan}
                onChange={(e) => setBanner({ ...banner, slogan: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>
          </div>
        )}

        {activeTab === "desc" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <label className="text-xs font-bold text-slate-300 block mb-1">Описание канала</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white"
            />
          </div>
        )}

        <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <Link href="/channel" className="text-xs text-slate-400 hover:text-white">
            Отмена
          </Link>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider"
          >
            <IconCheck size={16} />
            <span>Оплатить $50 и применить</span>
          </button>
        </div>
      </form>
    </div>
  );
}
