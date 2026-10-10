"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/game-engine/GameContext";
import { AvatarConfig, BannerConfig } from "@/types/game";
import { CHANNEL_TOPICS, DEFAULT_AVATAR, DEFAULT_BANNER } from "@/lib/game-engine/constants";
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
  IconSparkles,
} from "@/components/svg/icons";

export default function CreateChannelPage() {
  const router = useRouter();
  const { createChannel, state } = useGame();

  // Channel details
  const [name, setName] = useState(state.channel?.name || "");
  const [topic, setTopic] = useState<string>(state.channel?.topic || "Игры");
  const [description, setDescription] = useState(
    state.channel?.description ||
      "Добро пожаловать на мой официальный канал! Здесь вы найдете лучшие игровые стримы, летсплеи, обзоры новинок и прохождения."
  );

  // Avatar config state
  const [avatar, setAvatar] = useState<AvatarConfig>(state.channel?.avatar || DEFAULT_AVATAR);

  // Banner config state
  const [banner, setBanner] = useState<BannerConfig>(state.channel?.banner || DEFAULT_BANNER);

  // Active tab in constructor: 'details' | 'avatar' | 'banner'
  const [activeTab, setActiveTab] = useState<"details" | "avatar" | "banner">("details");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Real-time Brand Score
  const scoreBreakdown = useMemo(() => {
    return calculateBrandScore(name, topic, description, avatar, banner);
  }, [name, topic, description, avatar, banner]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (name.trim().length < 3 || name.trim().length > 30) {
      setErrorMsg("Название канала должно содержать от 3 до 30 символов");
      setActiveTab("details");
      return;
    }

    const res = createChannel(name, topic, description, avatar, banner);
    if (res.success) {
      router.push("/channel");
    } else {
      setErrorMsg(res.error || "Ошибка при создании канала");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-2 border border-red-500/30">
              <IconSparkles size={14} />
              Шаг 1 онбординга: Создание медиа-бренда
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              {state.channel ? "Переоформление канала" : "Создать свой канал"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Настройте визуальное оформление в SVG-конструкторе. Чем выше Brand Score, тем больше охваты и CTR!
            </p>
          </div>

          {/* Brand Score Gauge */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center gap-4 shrink-0 shadow-inner">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-500 flex flex-col items-center justify-center text-amber-400">
              <IconBrandScore size={18} />
              <span className="text-xs font-black">{scoreBreakdown.totalBrandScore}</span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-300">Brand Score</div>
              <div className="text-[11px] text-slate-400">
                CTR подписок: <span className="text-emerald-400 font-bold">+{(scoreBreakdown.totalBrandScore / 20).toFixed(1)}%</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Стартовый охват: <span className="text-emerald-400 font-bold">+{(scoreBreakdown.totalBrandScore / 40).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Channel Header Preview */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Предпросмотр шапки канала
          </div>
          <div className="relative">
            <BannerRenderer config={banner} channelName={name || "НАЗВАНИЕ КАНАЛА"} height="180px" />
            <div className="absolute -bottom-6 left-6 flex items-end gap-3 z-10">
              <div className="p-1 bg-slate-900 rounded-2xl shadow-2xl">
                <AvatarRenderer config={avatar} size={76} />
              </div>
              <div className="mb-2 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-xs">
                <span className="font-bold text-white">{name || "Без названия"}</span>
                <span className="text-slate-400 ml-2">Тематика: {topic}</span>
              </div>
            </div>
          </div>
          <div className="h-6" /> {/* spacer for avatar offset */}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-all ${
            activeTab === "details"
              ? "border-red-500 text-red-400 bg-red-950/20"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <IconTextTool size={18} />
          <span>1. Инфо и Тематика ({scoreBreakdown.nameScore + scoreBreakdown.descriptionScore}/200)</span>
        </button>
        <button
          onClick={() => setActiveTab("avatar")}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-all ${
            activeTab === "avatar"
              ? "border-red-500 text-red-400 bg-red-950/20"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <IconAvatarEditor size={18} />
          <span>2. Конструктор Аватара ({scoreBreakdown.avatarScore}/100)</span>
        </button>
        <button
          onClick={() => setActiveTab("banner")}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-all ${
            activeTab === "banner"
              ? "border-red-500 text-red-400 bg-red-950/20"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <IconBannerEditor size={18} />
          <span>3. Конструктор Баннера ({scoreBreakdown.bannerScore}/100)</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-sm rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab 1: Details */}
        {activeTab === "details" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-1.5">
                Название канала (3–30 символов)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: CyberGamer, TechMaster, Влоггер..."
                maxLength={30}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors font-medium"
              />
              <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
                <span>Скоринг запоминаемости: {scoreBreakdown.nameScore}/100</span>
                <span>{name.length}/30</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-1.5">
                Основная тематика контента
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {CHANNEL_TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className={`p-3 rounded-xl border text-sm font-bold text-left transition-all ${
                      topic === t
                        ? "bg-red-600/20 border-red-500 text-white shadow-md shadow-red-950/30"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-1.5">
                Описание канала (до 1000 символов)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Расскажите будущим подписчикам, о чем ваш канал..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors text-sm"
              />
              <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
                <span>Скоринг ключевых слов: {scoreBreakdown.descriptionScore}/100</span>
                <span>{description.length}/1000</span>
              </div>
            </div>

            {/* Recommendations */}
            {scoreBreakdown.tips.length > 0 && (
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-amber-400 mb-2 uppercase tracking-wider">
                  Советы по увеличению Brand Score:
                </div>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {scoreBreakdown.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Avatar SVG Constructor */}
        {activeTab === "avatar" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Preview Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <div className="mb-4">
                <AvatarRenderer config={avatar} size={140} className="shadow-2xl" />
              </div>
              <div className="text-sm font-bold text-white mb-1">Предпросмотр аватара</div>
              <div className="text-xs text-slate-400">
                Оценка привлекательности: <span className="text-emerald-400 font-bold">{scoreBreakdown.avatarScore}/100</span>
              </div>
            </div>

            {/* Controls */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              {/* Shape */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block flex items-center gap-1.5">
                  <IconShape size={14} /> Форма значка
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["circle", "rounded", "square", "hexagon"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setAvatar({ ...avatar, shape: s })}
                      className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                        avatar.shape === s
                          ? "bg-red-600 text-white border-red-500"
                          : "bg-slate-950 border-slate-700 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {s === "circle" ? "Круг" : s === "rounded" ? "Скруглённый" : s === "square" ? "Квадрат" : "Гексагон"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gradient background */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block flex items-center gap-1.5">
                  <IconPalette size={14} /> Цветовая гамма фона
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {[
                    { id: "cyberpunk", name: "Киберпанк" },
                    { id: "sunset", name: "Закат" },
                    { id: "neon-matrix", name: "Матрица" },
                    { id: "gold-rush", name: "Золото" },
                    { id: "crimson", name: "Багровый" },
                    { id: "amethyst", name: "Аметист" },
                    { id: "midnight", name: "Полночь" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setAvatar({ ...avatar, bgGradient: g.id })}
                      className={`p-2 text-[11px] font-bold rounded-lg border text-center transition-all ${
                        avatar.bgGradient === g.id
                          ? "bg-red-600/30 border-red-500 text-white"
                          : "bg-slate-950 border-slate-700 text-slate-400 hover:text-white"
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eyes & Mouth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    Выражение глаз
                  </label>
                  <select
                    value={avatar.eyes}
                    onChange={(e) => setAvatar({ ...avatar, eyes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  >
                    <option value="normal">Обычные (фокус)</option>
                    <option value="wink">Подмигивание</option>
                    <option value="cool">Крутые очки</option>
                    <option value="happy">Радостные</option>
                    <option value="glow">Кибер-сканер</option>
                    <option value="stars">Звёздный взгляд</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    Эмоция рта
                  </label>
                  <select
                    value={avatar.mouth}
                    onChange={(e) => setAvatar({ ...avatar, mouth: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  >
                    <option value="smile">Улыбка</option>
                    <option value="open">Восторг / Смех</option>
                    <option value="smirk">Ухмылка</option>
                    <option value="gamer">Геймерский драйв</option>
                    <option value="neutral">Нейтральный</option>
                  </select>
                </div>
              </div>

              {/* Accessory & Border */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    Аксессуар персонажа
                  </label>
                  <select
                    value={avatar.accessory}
                    onChange={(e) => setAvatar({ ...avatar, accessory: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  >
                    <option value="none">Без аксессуара</option>
                    <option value="headphones">Стримерские наушники</option>
                    <option value="crown">Корона короля трендов</option>
                    <option value="glasses">Стильные очки</option>
                    <option value="cap">Кепка создателя</option>
                    <option value="cyber-visor">Кибер-визор будущего</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    Стиль внешней рамки
                  </label>
                  <select
                    value={avatar.border}
                    onChange={(e) => setAvatar({ ...avatar, border: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  >
                    <option value="none">Без рамки</option>
                    <option value="neon">Неоновое свечение</option>
                    <option value="gold">Двойное золото</option>
                    <option value="cyber">Кибер-уголки</option>
                  </select>
                </div>
              </div>

              {/* Monogram tag */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Монограмма / Инициалы (1-2 символа в углу)
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={avatar.monogram}
                  onChange={(e) => setAvatar({ ...avatar, monogram: e.target.value.toUpperCase() })}
                  placeholder="YT"
                  className="w-24 bg-slate-950 border border-slate-700 rounded-lg p-2 text-center text-sm font-black text-white uppercase"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Banner SVG Constructor */}
        {activeTab === "banner" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Стиль фона баннера
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: "cyber-grid", label: "Кибер-Сетка" },
                  { id: "synthwave", label: "Ретровейв" },
                  { id: "studio-waves", label: "Звуковые волны" },
                  { id: "dots-matrix", label: "Точечная матрица" },
                  { id: "minimal-geo", label: "Минимал геометрия" },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setBanner({ ...banner, bgStyle: st.id })}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      banner.bgStyle === st.id
                        ? "bg-red-600 text-white border-red-500"
                        : "bg-slate-950 border-slate-700 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Основной цвет баннера
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={banner.colorA}
                    onChange={(e) => setBanner({ ...banner, colorA: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-300">{banner.colorA}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Вторичный цвет градиента
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={banner.colorB}
                    onChange={(e) => setBanner({ ...banner, colorB: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-300">{banner.colorB}</span>
                </div>
              </div>
            </div>

            {/* Slogan */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                Слоган канала на баннере
              </label>
              <input
                type="text"
                value={banner.slogan}
                onChange={(e) => setBanner({ ...banner, slogan: e.target.value })}
                placeholder="Например: Игры, обзоры и ламповая атмосфера!"
                maxLength={60}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Mascot Toggle & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Маскот / Иллюстрация
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBanner({ ...banner, showMascot: !banner.showMascot })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      banner.showMascot
                        ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                        : "bg-slate-950 border-slate-700 text-slate-400"
                    }`}
                  >
                    {banner.showMascot ? "Включен" : "Отключен"}
                  </button>
                  {banner.showMascot && (
                    <select
                      value={banner.mascotType}
                      onChange={(e) => setBanner({ ...banner, mascotType: e.target.value })}
                      className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="streamer">Геймпад / Консоль</option>
                      <option value="robot">Кибер-Бот</option>
                      <option value="camera">Студийная камера</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Socials checkboxes */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Иконки соцсетей в правом углу
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={banner.socials.youtube}
                      onChange={(e) =>
                        setBanner({
                          ...banner,
                          socials: { ...banner.socials, youtube: e.target.checked },
                        })
                      }
                      className="rounded bg-slate-950 border-slate-700 text-red-600 focus:ring-0"
                    />
                    <span>YouTube</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={banner.socials.twitter}
                      onChange={(e) =>
                        setBanner({
                          ...banner,
                          socials: { ...banner.socials, twitter: e.target.checked },
                        })
                      }
                      className="rounded bg-slate-950 border-slate-700 text-red-600 focus:ring-0"
                    />
                    <span>Twitter/X</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={banner.socials.discord}
                      onChange={(e) =>
                        setBanner({
                          ...banner,
                          socials: { ...banner.socials, discord: e.target.checked },
                        })
                      }
                      className="rounded bg-slate-950 border-slate-700 text-red-600 focus:ring-0"
                    />
                    <span>Discord</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={banner.socials.twitch}
                      onChange={(e) =>
                        setBanner({
                          ...banner,
                          socials: { ...banner.socials, twitch: e.target.checked },
                        })
                      }
                      className="rounded bg-slate-950 border-slate-700 text-red-600 focus:ring-0"
                    />
                    <span>Twitch</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Action Bar */}
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="text-xs text-slate-400">
            Итоговый Brand Score:{" "}
            <span className="text-amber-400 font-bold text-sm ml-1">
              {scoreBreakdown.totalBrandScore}/100
            </span>
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-red-950/40"
          >
            <IconCheck size={18} />
            <span>Сохранить и активировать канал</span>
          </button>
        </div>
      </form>
    </div>
  );
}
