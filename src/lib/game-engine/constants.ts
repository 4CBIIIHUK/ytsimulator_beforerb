import { TeamMember, LeaderboardUser, BoostKey, AvatarConfig, BannerConfig } from "@/types/game";

export const INITIAL_BALANCE = 500;
export const BASE_PRODUCTION_MS = 20000;
export const MIN_PRODUCTION_MS = 4000;
export const GAME_SECONDS_PER_MONTH = 720; // 1 real second = 1 game hour

export const CHANNEL_TOPICS = [
  "Игры",
  "Влоги",
  "Образование",
  "Челленджи",
  "Обзоры",
  "Музыка",
  "Кино",
  "Спорт",
  "Наука",
  "Юмор",
] as const;

export const TOPIC_COLORS: Record<string, [string, string]> = {
  Игры: ["#7c3aed", "#06b6d4"],
  Влоги: ["#f97316", "#f43f5e"],
  Образование: ["#2563eb", "#22d3ee"],
  Челленджи: ["#dc2626", "#facc15"],
  Обзоры: ["#0f766e", "#84cc16"],
  Музыка: ["#db2777", "#8b5cf6"],
  Кино: ["#111827", "#ef4444"],
  Спорт: ["#16a34a", "#eab308"],
  Наука: ["#1e3a8a", "#a855f7"],
  Юмор: ["#f59e0b", "#ec4899"],
};

export const DEFAULT_AVATAR: AvatarConfig = {
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
};

export const DEFAULT_BANNER: BannerConfig = {
  bgStyle: "cyber-grid",
  colorA: "#2563eb",
  colorB: "#1e1b4b",
  slogan: "Лучший контент каждую неделю!",
  showMascot: true,
  mascotType: "streamer",
  socials: { youtube: true, twitter: true, discord: true, twitch: false },
};

export const INITIAL_TEAM: TeamMember[] = [
  { id: "scriptwriter_1", role: "scriptwriter", name: "Алексей, сценарист", level: 1, salaryPerMin: 4, hireCost: 150, bonusDesc: "Удержание x1.4 для всех видео", hired: false, icon: "text" },
  { id: "editor_1", role: "editor", name: "Кирилл, монтажёр", level: 1, salaryPerMin: 6, hireCost: 250, bonusDesc: "Скорость производства x1.5 и +1 слот производства", hired: false, icon: "software" },
  { id: "designer_1", role: "designer", name: "Анна, дизайнер превью", level: 1, salaryPerMin: 5, hireCost: 200, bonusDesc: "CTR x1.35 и скидка 30% на превью", hired: false, icon: "palette" },
  { id: "manager_1", role: "manager", name: "Максим, PR-менеджер", level: 1, salaryPerMin: 10, hireCost: 450, bonusDesc: "Спонсорские выплаты x1.5, офферы на выкуп +10%", hired: false, icon: "handshake" },
  { id: "sound_1", role: "sound", name: "Елена, саунд-дизайнер", level: 1, salaryPerMin: 5, hireCost: 220, bonusDesc: "Охват Shorts x1.3, удержание x1.15", hired: false, icon: "mic" },
];

export const THUMBNAIL_TIERS = [
  { tier: 0, name: "Скриншот из видео", desc: "Бесплатно. Случайный кадр.", mult: 1, baseCost: 0 },
  { tier: 1, name: "Самодельное превью", desc: "Текст и контраст.", mult: 1.35, baseCost: 15 },
  { tier: 2, name: "Фрилансер", desc: "Чистая композиция, эмоция.", mult: 1.8, baseCost: 60 },
  { tier: 3, name: "Про-дизайнер", desc: "Фотосессия, ретушь, свечение.", mult: 2.6, baseCost: 250 },
  { tier: 4, name: "AI A/B студия", desc: "4 варианта, побеждает лучший.", mult: 3.8, baseCost: 1000 },
];

export const BOOST_DEFS: Record<BoostKey, { name: string; desc: string; baseCost: number; reach: number; subs: number; longOnly?: boolean; shortsOnly?: boolean; preOnly?: boolean }> = {
  titleAB: { name: "A/B тест названия", desc: "Платформа тестирует 3 варианта заголовка", baseCost: 25, reach: 1.22, subs: 1 },
  seoPack: { name: "SEO-пакет", desc: "Теги, главы и описание от специалиста", baseCost: 40, reach: 1.3, subs: 1 },
  subtitles: { name: "Субтитры на 10 языков", desc: "Зарубежная аудитория", baseCost: 60, reach: 1.25, subs: 1.05 },
  endScreen: { name: "Конечная заставка", desc: "Призыв подписаться и следующее видео", baseCost: 15, reach: 1.05, subs: 1.4, longOnly: true },
  premiere: { name: "Премьера с чатом", desc: "Событие для подписчиков, только до выхода", baseCost: 35, reach: 1.15, subs: 1.25, longOnly: true, preOnly: true },
  hashtags: { name: "Трендовые хэштеги", desc: "Попадание в ленты Shorts по хэштегам", baseCost: 20, reach: 1.25, subs: 1.05, shortsOnly: true },
  pinnedComment: { name: "Закреплённый комментарий", desc: "Бесплатно: вопрос к зрителям", baseCost: 0, reach: 1.03, subs: 1.1 },
};

export const AD_PACKAGES = [
  { id: "p1", name: "Пробный буст", cost: 20 },
  { id: "p2", name: "Стандарт", cost: 120 },
  { id: "p3", name: "Таргет PRO", cost: 700 },
  { id: "p4", name: "Национальная кампания", cost: 5000 },
  { id: "p5", name: "Глобальная кампания", cost: 40000 },
  { id: "p6", name: "Мега-охват", cost: 400000 },
  { id: "p7", name: "Захват платформы", cost: 5000000 },
];

/** views per dollar of promotion */
export const VIEWS_PER_DOLLAR = { shorts: 45, video: 9 };

export const TREND_TEMPLATES: { topic: string; category: string }[] = [
  { topic: "Гейминг нейросетей", category: "Игры" },
  { topic: "Новый королевская битва-хит", category: "Игры" },
  { topic: "Спидраны ретро-игр", category: "Игры" },
  { topic: "Неделя без телефона", category: "Влоги" },
  { topic: "Переезд в другую страну", category: "Влоги" },
  { topic: "Утренние рутины миллионеров", category: "Влоги" },
  { topic: "Объясняю за 5 минут", category: "Образование" },
  { topic: "Финансовая грамотность", category: "Образование" },
  { topic: "24 часа в одном месте", category: "Челленджи" },
  { topic: "Последний, кто уберёт руку", category: "Челленджи" },
  { topic: "Бюджетный сетап vs $10 000", category: "Обзоры" },
  { topic: "Распаковка нового флагмана", category: "Обзоры" },
  { topic: "Ремикс вирусного трека", category: "Музыка" },
  { topic: "Реакции на хиты 2000-х", category: "Музыка" },
  { topic: "Разбор финала сериала", category: "Кино" },
  { topic: "Пасхалки нового блокбастера", category: "Кино" },
  { topic: "Трансформация тела за 30 дней", category: "Спорт" },
  { topic: "Финал чемпионата", category: "Спорт" },
  { topic: "Квантовые компьютеры дома", category: "Наука" },
  { topic: "Новая миссия на Марс", category: "Наука" },
  { topic: "Мемы недели", category: "Юмор" },
  { topic: "Пародии на рекламу", category: "Юмор" },
];

export const AD_BRANDS = [
  { brand: "Nordic VPN Pro", desc: "Интеграция в начале ролика, 30 сек" },
  { brand: "Energy Blast", desc: "Банка энергетика в кадре и ссылка" },
  { brand: "CyberForge Gear", desc: "Обзор механической клавиатуры" },
  { brand: "Nova Cloud", desc: "Промокод на хостинг в описании" },
  { brand: "Titan Bank", desc: "Нативная интеграция карты" },
  { brand: "SkillBox Academy", desc: "Реклама онлайн-курса" },
  { brand: "Raid of Legends", desc: "Мобильная игра, 60 сек" },
  { brand: "FreshMeal Box", desc: "Доставка наборов еды" },
  { brand: "Orbit Phones", desc: "Анбоксинг нового смартфона" },
  { brand: "HyperDrive Auto", desc: "Тест-драйв электрокара" },
];

export const BUYER_COMPANIES = [
  { id: "omni", name: "OmniMedia Group", logo: "omni" as const, multiplier: 1.05, conditions: ["Сохранить название 30 дней", "Не создавать конкурента 60 дней", "Право на архив роликов"] },
  { id: "cyber", name: "CyberStream Corp", logo: "cyber" as const, multiplier: 1.15, conditions: ["Логотип холдинга в шапке", "Права на ретрансляцию", "Сохранить расписание 30 дней"] },
  { id: "apex", name: "Apex Digital Holdings", logo: "apex" as const, multiplier: 1.2, conditions: ["Передача товарного знака", "Не выпускать влоги о продаже 90 дней", "Сохранить команду"] },
  { id: "hyperion", name: "Hyperion Syndicate", logo: "hyperion" as const, multiplier: 1.3, conditions: ["Включение в медиасеть", "Опцион на следующие каналы", "Политика вещания холдинга"] },
  { id: "vanguard", name: "Vanguard Entertainment", logo: "vanguard" as const, multiplier: 1.25, conditions: ["Исходники всех видео", "Международный дубляж", "Мораторий на похожие названия"] },
  { id: "googol", name: "Googol Syndicate Global", logo: "googol" as const, multiplier: 1.6, conditions: ["Интеграция в суперкластер", "Доступ к AI-алгоритмам", "Абсолютный медиа-престиж"] },
];

export const COMMENT_POOL = [
  "Монтаж огонь, подписался!",
  "Кто смотрит в 2026?",
  "Превью кликнул сразу, не пожалел",
  "Сделай продолжение, пожалуйста",
  "Лучший канал по теме, без воды",
  "Алгоритм привёл, остаюсь",
  "Звук стал намного лучше!",
  "Ставлю лайк не глядя",
  "Хочу коллаб с тобой",
  "Это должно быть в трендах",
  "Пересмотрел три раза",
  "Скинул другу, ждём новое видео",
];

export const COMMENT_AUTHORS = ["CyberFan_99", "Alex_ProGamer", "Vera_Tech", "MemeLord", "Kate.Vlogs", "NeoViewer", "DimaPlays", "Sonya_Art", "ZeroLag", "QuantumCat"];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { id: "lb_1", rank: 1, channelName: "Googol Media Universe", subscribers: 1_000_000_000, views: 450_000_000_000, category: "Медиа", isPlayer: false, playButton: "googol", brandScore: 100 },
  { id: "lb_2", rank: 2, channelName: "MrBeast Prodigy", subscribers: 310_000_000, views: 89_000_000_000, category: "Челленджи", isPlayer: false, playButton: "ruby", brandScore: 98 },
  { id: "lb_3", rank: 3, channelName: "T-Series Prime", subscribers: 275_000_000, views: 120_000_000_000, category: "Музыка", isPlayer: false, playButton: "ruby", brandScore: 95 },
  { id: "lb_4", rank: 4, channelName: "Pewd Legacy", subscribers: 111_000_000, views: 31_000_000_000, category: "Игры", isPlayer: false, playButton: "ruby", brandScore: 96 },
  { id: "lb_5", rank: 5, channelName: "Cocomelon Kids Joy", subscribers: 85_000_000, views: 42_000_000_000, category: "Образование", isPlayer: false, playButton: "diamond", brandScore: 92 },
  { id: "lb_6", rank: 6, channelName: "5-Minute Tech Hacks", subscribers: 28_000_000, views: 9_500_000_000, category: "Обзоры", isPlayer: false, playButton: "diamond", brandScore: 89 },
  { id: "lb_7", rank: 7, channelName: "Veritas Science World", subscribers: 14_000_000, views: 3_800_000_000, category: "Наука", isPlayer: false, playButton: "diamond", brandScore: 94 },
  { id: "lb_8", rank: 8, channelName: "Dude Perfect Tricks", subscribers: 9_800_000, views: 2_900_000_000, category: "Спорт", isPlayer: false, playButton: "gold", brandScore: 91 },
  { id: "lb_9", rank: 9, channelName: "Cinema Sins Daily", subscribers: 3_500_000, views: 980_000_000, category: "Кино", isPlayer: false, playButton: "gold", brandScore: 88 },
  { id: "lb_10", rank: 10, channelName: "Lofi Beats & Chill", subscribers: 1_200_000, views: 520_000_000, category: "Музыка", isPlayer: false, playButton: "gold", brandScore: 87 },
];
