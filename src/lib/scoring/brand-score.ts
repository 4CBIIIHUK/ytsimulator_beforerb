import { AvatarConfig, BannerConfig } from "@/types/game";

export interface BrandScoreBreakdown {
  avatarScore: number;
  bannerScore: number;
  descriptionScore: number;
  nameScore: number;
  totalBrandScore: number;
  tips: string[];
}

export function calculateBrandScore(
  name: string,
  topic: string,
  description: string,
  avatar: AvatarConfig,
  banner: BannerConfig
): BrandScoreBreakdown {
  const tips: string[] = [];

  // 1. Name Score (0-100)
  let nameScore = 0;
  const trimmedName = name.trim();
  if (trimmedName.length >= 3 && trimmedName.length <= 25) {
    nameScore += 40;
    // Memorability: check case mix, no consecutive digits spam, punchy length
    if (trimmedName.length >= 4 && trimmedName.length <= 16) {
      nameScore += 25;
    }
    if (/^[A-Za-z0-9 _-]+$/.test(trimmedName)) {
      nameScore += 20;
    }
    // Has vowels and readable consonants
    if (/[aeiouyаеёиоуыэюя]/i.test(trimmedName)) {
      nameScore += 15;
    }
  } else if (trimmedName.length > 0) {
    nameScore += 20;
    tips.push("Оптимальная длина названия канала: от 4 до 16 символов");
  } else {
    tips.push("Придумайте запоминающееся название канала");
  }

  // 2. Avatar Score (0-100)
  let avatarScore = 20;
  if (avatar.bgGradient && avatar.bgGradient !== "plain") avatarScore += 20;
  if (avatar.eyes && avatar.eyes !== "none") avatarScore += 20;
  if (avatar.accessory && avatar.accessory !== "none") avatarScore += 20;
  if (avatar.border && avatar.border !== "none") avatarScore += 10;
  if (avatar.monogram && avatar.monogram.trim().length > 0) avatarScore += 10;
  if (avatarScore > 100) avatarScore = 100;

  if (avatar.accessory === "none") {
    tips.push("Добавьте аксессуар в аватаре (наушники, козырек, очки)");
  }

  // 3. Banner Score (0-100)
  let bannerScore = 20;
  if (banner.bgStyle && banner.bgStyle !== "solid") bannerScore += 25;
  if (banner.slogan && banner.slogan.trim().length >= 5) {
    bannerScore += 25;
  } else {
    tips.push("Укажите звучный слоган на баннере (от 5 символов)");
  }
  if (banner.showMascot) bannerScore += 15;
  const socialCount = Object.values(banner.socials).filter(Boolean).length;
  bannerScore += Math.min(15, socialCount * 5);
  if (socialCount === 0) {
    tips.push("Включите иконки соцсетей на баннере для доверия");
  }
  if (bannerScore > 100) bannerScore = 100;

  // 4. Description Score (0-100)
  let descriptionScore = 10;
  const desc = description.trim();
  const descWords = desc.split(/\s+/).filter(Boolean);
  if (descWords.length >= 10) descriptionScore += 30;
  else if (descWords.length >= 4) descriptionScore += 15;

  if (descWords.length >= 25) descriptionScore += 25;
  
  // Topic keywords relevance
  const topicKeywords: Record<string, string[]> = {
    "Игры": ["гейминг", "летсплеи", "прохождение", "стрим", "игры", "обзор", "game", "play"],
    "Влоги": ["влог", "жизнь", "путешествия", "рутина", "моя жизнь", "vlog", "life"],
    "Образование": ["уроки", "наука", "обучение", "факты", "знания", "курс", "learn", "how"],
    "Челленджи": ["челлендж", "24 часа", "проверка", "эксперимент", "вызов", "challenge"],
    "Обзоры": ["обзор", "тест", "распаковка", "сравнение", "девайс", "review", "test"],
    "Музыка": ["трек", "биты", "музыка", "кавер", "песня", "клип", "music", "song"],
    "Кино": ["кино", "фильмы", "разбор", "сериалы", "пасхалки", "cinema", "movie"],
    "Спорт": ["тренировки", "спорт", "фитнес", "мотивация", "рекорды", "sport"],
    "Наука": ["технологии", "космос", "будущее", "исследования", "наука", "science"],
    "Юмор": ["приколы", "мемы", "скетчи", "стендап", "шутки", "юмор", "comedy"],
  };

  const relevantWords = topicKeywords[topic] || ["видео", "контент", "канал"];
  const matches = relevantWords.filter((w) => desc.toLowerCase().includes(w.toLowerCase())).length;
  if (matches >= 2) descriptionScore += 35;
  else if (matches >= 1) descriptionScore += 20;
  else {
    tips.push(`Добавьте в описание ключевые слова по теме (${topic})`);
  }

  if (descriptionScore > 100) descriptionScore = 100;

  const totalBrandScore = Math.round(
    avatarScore * 0.3 +
    bannerScore * 0.3 +
    descriptionScore * 0.2 +
    nameScore * 0.2
  );

  return {
    avatarScore: Math.min(100, Math.max(0, avatarScore)),
    bannerScore: Math.min(100, Math.max(0, bannerScore)),
    descriptionScore: Math.min(100, Math.max(0, descriptionScore)),
    nameScore: Math.min(100, Math.max(0, nameScore)),
    totalBrandScore: Math.min(100, Math.max(0, totalBrandScore)),
    tips,
  };
}
