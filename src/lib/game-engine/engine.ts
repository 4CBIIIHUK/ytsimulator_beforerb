import {
  GameState,
  Modifiers,
  VideoItem,
  TrendItem,
  AdOffer,
  BuyoutOffer,
  GameEvent,
  BoostKey,
  VideoBoosts,
  BuyerLogoType,
} from "@/types/game";
import { UPGRADES, upgradeMult, upgradeCost, getUpgrade } from "./upgrades";
import {
  BASE_PRODUCTION_MS,
  MIN_PRODUCTION_MS,
  GAME_SECONDS_PER_MONTH,
  THUMBNAIL_TIERS,
  BOOST_DEFS,
  AD_PACKAGES,
  VIEWS_PER_DOLLAR,
  TREND_TEMPLATES,
  AD_BRANDS,
  BUYER_COMPANIES,
  COMMENT_POOL,
  COMMENT_AUTHORS,
} from "./constants";

export const rand = (a: number, b: number) => a + Math.random() * (b - a);
export const uid = (p: string) => `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
const randNormal = () => {
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

export interface ActionResult {
  state: GameState;
  ok: boolean;
  error?: string;
  events: GameEvent[];
}

const fail = (state: GameState, error: string): ActionResult => ({ state, ok: false, error, events: [] });

// ---------------------------------------------------------------------------
// Modifiers
// ---------------------------------------------------------------------------
export function computeModifiers(state: GameState): Modifiers {
  const m: Modifiers = {
    reach: 1, ctr: 1, retention: 1, cpm: 1, subs: 1, speed: 1, trend: 1, ads: 1, tail: 1,
    shorts: 1, longform: 1, sponsor: 1, brand: 1, meta: 1, slots: 1,
  };
  for (const def of UPGRADES) {
    const lvl = state.upgrades[def.id] || 0;
    m[def.stat] *= upgradeMult(def, lvl);
  }
  for (const t of state.team) {
    if (!t.hired) continue;
    if (t.role === "scriptwriter") m.retention *= 1.4;
    if (t.role === "editor") { m.speed *= 1.5; m.slots += 1; }
    if (t.role === "designer") m.ctr *= 1.35;
    if (t.role === "manager") m.sponsor *= 1.5;
    if (t.role === "sound") { m.shorts *= 1.3; m.retention *= 1.15; }
  }
  m.slots += Math.floor((state.upgrades["pc"] || 0) / 5);
  const bs = state.channel?.brandScore ?? 0;
  m.brand = 0.6 + (bs / 100) * 0.9; // 0.6 .. 1.5
  m.meta = 1 + 0.1 * (state.stats.soldChannelsCount || 0);
  return m;
}

export function hasRole(state: GameState, role: string) {
  return state.team.some((t) => t.role === role && t.hired);
}

export function priceScale(state: GameState) {
  return Math.max(1, Math.pow(Math.max(1, state.stats.subscribers) / 1000, 0.6));
}

export function thumbnailCost(state: GameState, tier: number) {
  const t = THUMBNAIL_TIERS[tier];
  if (!t) return 0;
  return Math.round(t.baseCost * priceScale(state) * (hasRole(state, "designer") ? 0.7 : 1));
}

export function boostCost(state: GameState, key: BoostKey) {
  return Math.round(BOOST_DEFS[key].baseCost * priceScale(state));
}

export function adPackageViews(state: GameState, type: "video" | "shorts", cost: number) {
  const mods = computeModifiers(state);
  return Math.round(cost * VIEWS_PER_DOLLAR[type] * mods.ads);
}

export function rushCost(state: GameState, video: VideoItem, now: number) {
  const remaining = Math.max(0, video.readyAt - now) / 1000;
  return Math.max(5, Math.round(remaining * 1.5 * priceScale(state)));
}

export function productionMs(mods: Modifiers) {
  return Math.max(MIN_PRODUCTION_MS, Math.round(BASE_PRODUCTION_MS / mods.speed));
}

export function isGoodLength(type: "video" | "shorts", duration: number) {
  return type === "shorts" ? duration >= 20 && duration <= 45 : duration >= 1200;
}

export function lengthFactor(type: "video" | "shorts", d: number) {
  if (type === "shorts") {
    if (d >= 20 && d <= 45) return 1.25;
    return d < 20 ? 0.8 : 0.9;
  }
  if (d >= 2400) return 1.3;
  if (d >= 1200) return 1.25;
  if (d >= 480) return 1.0;
  return 0.7;
}

export function qualityFromMods(mods: Modifiers) {
  return Math.max(10, Math.min(99, Math.round(20 + 14 * Math.log(mods.retention))));
}

export function boostReachMult(b: VideoBoosts) {
  let m = THUMBNAIL_TIERS[b.thumbnailTier]?.mult ?? 1;
  (Object.keys(BOOST_DEFS) as BoostKey[]).forEach((k) => {
    if (b[k]) m *= BOOST_DEFS[k].reach;
  });
  return m;
}

export function boostSubsMult(b: VideoBoosts) {
  let m = 1;
  (Object.keys(BOOST_DEFS) as BoostKey[]).forEach((k) => {
    if (b[k]) m *= BOOST_DEFS[k].subs;
  });
  return m;
}

export function videoPeff(v: VideoItem) {
  return v.basePotential * boostReachMult(v.boosts);
}

export function trendForTopic(state: GameState, topic: string, mods?: Modifiers) {
  const m = mods ?? computeModifiers(state);
  const matches = state.trends.filter((t) => t.category === topic);
  if (matches.length === 0) return { mult: 1, cpm: 1, trend: null as TrendItem | null };
  const best = matches.reduce((a, b) => (a.hype > b.hype ? a : b));
  const mult = 1 + (best.baseViewsMult - 1) * (best.hype / 100) * m.trend;
  return { mult, cpm: 1 + (best.cpmMult - 1) * (best.hype / 100), trend: best };
}

/** Estimate (deterministic) organic potential before boosts. */
export function estimatePotential(
  state: GameState,
  type: "video" | "shorts",
  duration: number,
  topic: string,
  viral = 1
) {
  const mods = computeModifiers(state);
  const isShort = type === "shorts";
  const tr = trendForTopic(state, topic, mods);
  const fmt = isShort ? mods.shorts : mods.longform;
  const algoBase = isShort ? 1800 : 90;
  const topicFit = state.channel && state.channel.topic === topic ? 1.15 : 0.9;
  const algo =
    algoBase *
    mods.reach *
    Math.pow(mods.ctr, 0.85) *
    Math.pow(mods.retention, 0.7) *
    fmt *
    mods.brand *
    mods.meta *
    tr.mult *
    lengthFactor(type, duration) *
    topicFit *
    viral;
  const subsReach = state.stats.subscribers * (isShort ? 0.03 : 0.1) * Math.pow(mods.ctr, 0.25) * Math.min(2, mods.brand);
  const good = isGoodLength(type, duration);
  const floorNominal = isShort ? (good ? 5000 : 1000) : good ? 200 : 40;
  return { raw: algo + subsReach, floorNominal, trend: tr, good, mods };
}

function rollFloor(type: "video" | "shorts", good: boolean) {
  if (type === "shorts") {
    if (good) {
      // "меньше 5к сложно": rare dips down to ~3k
      return Math.random() < 0.08 ? 5000 * rand(0.6, 0.95) : 5000 * rand(1, 1.4);
    }
    return 1000 * rand(1, 1.6);
  }
  return good ? 200 * rand(1, 1.7) : 40 * rand(1, 2);
}

export const emptyBoosts = (): VideoBoosts => ({
  thumbnailTier: 0,
  titleAB: false,
  seoPack: false,
  subtitles: false,
  endScreen: false,
  premiere: false,
  pinnedComment: false,
  hashtags: false,
});

// ---------------------------------------------------------------------------
// Trends / offers generation
// ---------------------------------------------------------------------------
export function newTrend(existing: TrendItem[]): TrendItem {
  const used = new Set(existing.map((t) => t.topic));
  const pool = TREND_TEMPLATES.filter((t) => !used.has(t.topic));
  const tpl = pool[Math.floor(Math.random() * pool.length)] ?? TREND_TEMPLATES[0];
  return {
    id: uid("tr"),
    topic: tpl.topic,
    category: tpl.category,
    hype: rand(15, 35),
    momentum: "up",
    cpmMult: Math.round(rand(1.05, 1.6) * 100) / 100,
    baseViewsMult: Math.round(rand(1.6, 2.8) * 100) / 100,
    peakAt: 0,
  };
}

export function initialTrends(): TrendItem[] {
  const list: TrendItem[] = [];
  for (let i = 0; i < 5; i++) {
    const t = newTrend(list);
    t.hype = rand(30, 90);
    t.momentum = i % 2 === 0 ? "up" : "peak";
    t.peakAt = Date.now();
    list.push(t);
  }
  return list;
}

function makeAdOffer(state: GameState, mods: Modifiers, now: number): AdOffer {
  const b = AD_BRANDS[Math.floor(Math.random() * AD_BRANDS.length)];
  const subs = state.stats.subscribers;
  const recent = state.videos.filter((v) => v.status === "published").slice(0, 5);
  const avgViews = recent.length ? recent.reduce((a, v) => a + v.views, 0) / recent.length : 0;
  const bs = state.channel?.brandScore ?? 0;
  const payout = Math.round((25 + subs * rand(0.25, 0.9) + avgViews * 0.012) * (1 + bs / 200) * mods.sponsor);
  return {
    id: uid("ad"),
    brand: b.brand,
    productDesc: b.desc,
    requirementSubs: 0,
    payout,
    repRequired: 0,
    contractLengthVideos: 1,
    progressVideos: 0,
    status: "available",
    expiresAt: now + rand(90, 150) * 1000,
  };
}

export function makeBuyoutOffer(state: GameState, now: number): BuyoutOffer | null {
  if (!state.channel) return null;
  const subs = state.stats.subscribers;
  const bs = state.channel.brandScore;
  const rep = state.channel.reputation;
  const basePrice = subs * 0.5 + state.stats.monthlyRevenue * 18 + bs * 100 + rep * 50;
  let tierMult = 1;
  if (subs >= 1_000_000_000) tierMult = 50;
  else if (subs >= 1_000_000) tierMult = 5;
  const pool = subs >= 1_000_000_000 ? BUYER_COMPANIES : BUYER_COMPANIES.filter((b) => b.id !== "googol");
  const buyer = pool[Math.floor(Math.random() * pool.length)];
  const mgr = hasRole(state, "manager") ? 1.1 : 1;
  const price = Math.round(basePrice * rand(0.8, 1.3) * buyer.multiplier * tierMult * mgr);
  return {
    id: uid("bo"),
    buyerName: buyer.name,
    buyerLogo: buyer.logo as BuyerLogoType,
    basePrice,
    currentOfferPrice: Math.max(500, price),
    reputationMult: buyer.multiplier,
    createdAt: now,
    expiresAt: now + 60000,
    durationSec: 60,
    conditionText: buyer.conditions[Math.floor(Math.random() * buyer.conditions.length)],
    negotiatedCount: 0,
    status: "active",
  };
}

// ---------------------------------------------------------------------------
// Publish
// ---------------------------------------------------------------------------
function publishVideo(state: GameState, v: VideoItem, now: number, events: GameEvent[]): VideoItem {
  const viral = Math.random() < 0.06 ? rand(4, 15) : Math.exp(randNormal() * 0.35);
  const est = estimatePotential(state, v.type, v.duration, v.topic, viral);
  const floor = rollFloor(v.type, est.good);
  let base = Math.max(est.raw, floor);
  const campaigns = v.campaigns.map((c) => (c.startAt === 0 ? { ...c, startAt: now } : c));
  const prelaunchViews = campaigns.filter((c) => c.prelaunch).reduce((a, c) => a + c.totalViews, 0);
  base += prelaunchViews * 0.25; // ads at launch push the algorithm
  const published: VideoItem = {
    ...v,
    status: "published",
    publishedAt: now,
    basePotential: base,
    floor,
    goodLength: est.good,
    quality: qualityFromMods(est.mods),
    trendMult: est.trend.mult,
    trendName: est.trend.trend?.topic,
    viralMult: viral,
    campaigns,
  };
  events.push({
    kind: viral > 3 ? "success" : "info",
    text: viral > 3 ? `«${v.title}» залетело в рекомендации! Вирусный множитель x${viral.toFixed(1)}` : `«${v.title}» опубликовано`,
    sound: "success",
  });
  return published;
}

// ---------------------------------------------------------------------------
// Tick
// ---------------------------------------------------------------------------
const saturate = (x: number, cap = 0.2) => cap * (1 - Math.exp(-x / cap));

export function tick(prev: GameState, now: number, dt: number, offline = false): { state: GameState; events: GameEvent[] } {
  const events: GameEvent[] = [];
  let state: GameState = { ...prev };
  const mods = computeModifiers(state);
  const bs = state.channel?.brandScore ?? 0;

  // --- trends evolve
  let trends = state.trends.map((t) => {
    const n = { ...t };
    if (n.momentum === "up") {
      n.hype = Math.min(100, n.hype + rand(0.25, 0.8) * dt);
      if (n.hype >= 96 || (n.hype > 60 && Math.random() < 0.015 * dt)) {
        n.momentum = "peak";
        n.peakAt = now;
      }
    } else if (n.momentum === "peak") {
      if (now - n.peakAt > 25000) n.momentum = "down";
    } else {
      n.hype = Math.max(0, n.hype - rand(0.2, 0.6) * dt);
    }
    return n;
  });
  const before = trends.length;
  trends = trends.filter((t) => t.hype > 5);
  while (trends.length < 5) {
    const t = newTrend(trends);
    trends.push(t);
    if (!offline && trends.length > before - 1 && state.channel && t.category === state.channel.topic) {
      events.push({ kind: "info", text: `Новый тренд в вашей нише: «${t.topic}»` });
    }
  }
  state.trends = trends;

  // --- productions finishing
  let productionDone = false;
  let videos = state.videos.map((v) => {
    if (v.status === "production" && now >= v.readyAt) {
      productionDone = true;
      return publishVideo(state, v, now, events);
    }
    return v;
  });
  if (productionDone && state.onboardingStep === 3) {
    state.balance += 100;
    state.onboardingStep = 4;
    events.push({ kind: "money", text: "Онбординг: первое видео опубликовано, +$100", sound: "coin" });
  }

  // --- views / revenue / subs
  let addViews = 0;
  let addRev = 0;
  let addSubs = 0;
  videos = videos.map((v) => {
    if (v.status !== "published") return v;
    const isShort = v.type === "shorts";
    const age = (now - v.publishedAt) / 1000;
    const prevAge = Math.max(0, age - dt);
    const tau = isShort ? 45 : 90;
    const peff = videoPeff(v);
    const curve = Math.exp(-prevAge / tau) - Math.exp(-age / tau);
    const tail = (peff * 0.0006 * Math.sqrt(mods.tail) * dt) / (1 + age / 600);
    const organic = peff * curve + tail;

    let adDelta = 0;
    const campaigns = v.campaigns.map((c) => {
      if (c.startAt === 0 || c.delivered >= c.totalViews) return c;
      const elapsed = Math.min(c.durationSec, (now - c.startAt) / 1000);
      const target = (c.totalViews * elapsed) / c.durationSec;
      const d = Math.max(0, target - c.delivered);
      adDelta += d;
      return { ...c, delivered: c.delivered + d };
    });

    const rpm = (isShort ? 0.35 : v.duration >= 480 ? 6.4 : 4) * mods.cpm * (v.trendMult > 1.05 ? 1.2 : 1);
    const rev = ((organic + adDelta * 0.5) / 1000) * rpm;
    const qualityFactor = 0.7 + (v.quality / 100) * 0.6;
    const subRate = saturate((isShort ? 0.004 : 0.015) * mods.subs * (1 + bs / 200) * boostSubsMult(v.boosts) * qualityFactor);
    const subs = organic * subRate + adDelta * subRate * 0.4;

    addViews += organic + adDelta;
    addRev += rev;
    addSubs += subs;

    let comments = v.comments;
    if (!offline && comments.length < 8 && Math.random() < Math.min(0.3, (organic + adDelta) / 400)) {
      comments = [
        {
          id: uid("c"),
          author: COMMENT_AUTHORS[Math.floor(Math.random() * COMMENT_AUTHORS.length)],
          text: COMMENT_POOL[Math.floor(Math.random() * COMMENT_POOL.length)],
          likes: Math.floor(rand(0, 50) * (1 + v.views / 10000)),
        },
        ...comments,
      ];
    }

    return {
      ...v,
      views: v.views + organic + adDelta,
      adViews: v.adViews + adDelta,
      revenue: v.revenue + rev,
      subsGained: v.subsGained + subs,
      likes: v.likes + (organic + adDelta) * (0.03 + v.quality / 3000),
      dislikes: v.dislikes + (organic + adDelta) * 0.0015,
      campaigns,
      comments,
      lastVps: (organic + adDelta) / dt,
    };
  });

  // trend momentum moves the channel itself
  if (state.channel) {
    const tr = trendForTopic(state, state.channel.topic, mods);
    if (tr.trend) {
      addSubs += (0.4 + state.stats.subscribers * 0.0003) * (tr.trend.hype / 100) * Math.sqrt(mods.trend) * mods.brand * dt;
    }
  }

  if (videos.length > 250) videos = videos.slice(0, 250);
  state.videos = videos;

  // salaries
  const salaryPerMin = state.team.filter((t) => t.hired).reduce((a, t) => a + t.salaryPerMin, 0);
  state.balance = Math.max(0, state.balance + addRev - (salaryPerMin / 60) * dt);

  const revPerSec = addRev / dt;
  const emaW = Math.min(1, 0.08 * dt);
  const emaRev = state.stats.revenuePerSec * (1 - emaW) + revPerSec * emaW;
  const subsTotal = state.stats.subscribers + addSubs;
  state.stats = {
    ...state.stats,
    subscribers: subsTotal,
    totalViews: state.stats.totalViews + addViews,
    totalRevenue: state.stats.totalRevenue + addRev,
    lifetimeEarnings: (state.stats.lifetimeEarnings || 0) + addRev,
    revenuePerSec: emaRev,
    monthlyRevenue: emaRev * GAME_SECONDS_PER_MONTH,
    viewsPerSec: state.stats.viewsPerSec * (1 - emaW) + (addViews / dt) * emaW,
    subsPerSec: state.stats.subsPerSec * (1 - emaW) + (addSubs / dt) * emaW,
  };

  // channel level
  if (state.channel) {
    const s = subsTotal;
    const thresholds = [100, 1e3, 1e4, 1e5, 1e6, 1e7, 5e7, 1e8, 1e9];
    const level = 1 + thresholds.filter((t) => s >= t).length;
    if (!offline && level > state.channel.level) {
      events.push({ kind: "success", text: `Канал достиг уровня ${level}!`, sound: "success" });
    }
    const published = state.videos.filter((v) => v.status === "published").length;
    state.channel = {
      ...state.channel,
      level,
      reputation: Math.min(100, Math.floor(level * 7 + state.channel.brandScore * 0.2 + Math.min(20, published))),
    };
  }

  // ad offers
  let adOffers = state.adOffers.filter((o) => o.status === "available" && o.expiresAt > now);
  if (state.channel && now >= state.nextAdOfferAt) {
    if (adOffers.length < 4) {
      adOffers = [makeAdOffer(state, mods, now), ...adOffers];
      if (!offline) events.push({ kind: "info", text: "Новое рекламное предложение от бренда" });
    }
    state.nextAdOfferAt = now + (rand(35, 60) * 1000) / (1 + bs / 300);
  }
  state.adOffers = adOffers;

  // buyout offers
  if (!offline) {
    if (state.activeBuyoutOffer && state.activeBuyoutOffer.status === "active" && now > state.activeBuyoutOffer.expiresAt) {
      state.activeBuyoutOffer = null;
      events.push({ kind: "warning", text: "Оффер на выкуп канала истёк" });
    }
    if (now >= state.nextBuyoutAt) {
      state.nextBuyoutAt = now + rand(150, 210) * 1000;
      const eligible = state.channel && state.stats.subscribers >= 100 && !(state.activeBuyoutOffer?.status === "active");
      if (eligible) {
        state.buyoutTickCounter = (state.buyoutTickCounter || 0) + 1;
        const rare = state.stats.subscribers < 1000;
        if (!rare || state.buyoutTickCounter % 3 === 0) {
          const offer = makeBuyoutOffer(state, now);
          if (offer) {
            state.activeBuyoutOffer = offer;
            events.push({ kind: "money", text: `${offer.buyerName} хочет купить ваш канал!`, sound: "alert" });
          }
        }
      }
    }
  }

  state.lastTickTime = now;
  return { state, events };
}

export function simulateOffline(state: GameState, now: number) {
  const from = state.lastTickTime || now;
  const total = Math.min(6 * 3600, Math.max(0, (now - from) / 1000));
  if (total < 5) return { state: { ...state, lastTickTime: now }, earned: 0, seconds: 0 };
  const startBalance = state.balance;
  let s = state;
  const step = 30;
  let t = from;
  const end = from + total * 1000;
  while (t < end) {
    const dt = Math.min(step, (end - t) / 1000);
    t += dt * 1000;
    s = tick(s, t, dt, true).state;
  }
  s = { ...s, lastTickTime: now, nextBuyoutAt: Math.max(s.nextBuyoutAt, now + 60000) };
  if (s.activeBuyoutOffer && s.activeBuyoutOffer.expiresAt < now) s.activeBuyoutOffer = null;
  return { state: s, earned: s.balance - startBalance, seconds: total };
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
export interface ProductionForm {
  title: string;
  thumbnailText: string;
  topic: string;
  type: "video" | "shorts";
  duration: number;
  thumbnailStyle: string;
}

export function activeProductions(state: GameState) {
  return state.videos.filter((v) => v.status === "production");
}

export function startProduction(state: GameState, form: ProductionForm, now: number): ActionResult & { videoId?: string } {
  if (!state.channel) return fail(state, "Сначала создайте канал");
  if (!form.title.trim()) return fail(state, "Введите название видео");
  const mods = computeModifiers(state);
  if (activeProductions(state).length >= mods.slots) return fail(state, `Все слоты производства заняты (${mods.slots})`);
  const ms = productionMs(mods);
  const v: VideoItem = {
    id: uid("vid"),
    title: form.title.trim().slice(0, 100),
    thumbnailText: (form.thumbnailText || form.title).trim().slice(0, 24),
    topic: form.topic,
    type: form.type,
    duration: form.duration,
    thumbnailStyle: form.thumbnailStyle,
    status: "production",
    createdAt: now,
    readyAt: now + ms,
    productionMs: ms,
    publishedAt: 0,
    basePotential: 0,
    floor: 0,
    goodLength: isGoodLength(form.type, form.duration),
    views: 0,
    adViews: 0,
    likes: 0,
    dislikes: 0,
    revenue: 0,
    subsGained: 0,
    quality: qualityFromMods(mods),
    trendMult: 1,
    viralMult: 1,
    boosts: emptyBoosts(),
    campaigns: [],
    comments: [],
    lastVps: 0,
  };
  const events: GameEvent[] = [];
  let balance = state.balance;
  let step = state.onboardingStep;
  if (step === 2) {
    balance += 50;
    step = 3;
    events.push({ kind: "money", text: "Онбординг: съёмка началась, +$50", sound: "coin" });
  }
  return {
    state: {
      ...state,
      balance,
      onboardingStep: step,
      videos: [v, ...state.videos],
      stats: { ...state.stats, videosCreated: state.stats.videosCreated + 1 },
    },
    ok: true,
    events,
    videoId: v.id,
  };
}

function updateVideo(state: GameState, id: string, fn: (v: VideoItem) => VideoItem): GameState {
  return { ...state, videos: state.videos.map((v) => (v.id === id ? fn(v) : v)) };
}

export function buyThumbnail(state: GameState, id: string, tier: number): ActionResult {
  const v = state.videos.find((x) => x.id === id);
  if (!v) return fail(state, "Видео не найдено");
  if (tier <= v.boosts.thumbnailTier) return fail(state, "Уже есть превью этого уровня");
  const cost = thumbnailCost(state, tier);
  if (state.balance < cost) return fail(state, `Нужно $${cost}`);
  const s = updateVideo({ ...state, balance: state.balance - cost }, id, (x) => ({ ...x, boosts: { ...x.boosts, thumbnailTier: tier } }));
  return { state: s, ok: true, events: [{ kind: "success", text: `Новое превью: ${THUMBNAIL_TIERS[tier].name}`, sound: "coin" }] };
}

export function buyBoost(state: GameState, id: string, key: BoostKey): ActionResult {
  const v = state.videos.find((x) => x.id === id);
  if (!v) return fail(state, "Видео не найдено");
  const def = BOOST_DEFS[key];
  if (v.boosts[key]) return fail(state, "Уже куплено");
  if (def.longOnly && v.type !== "video") return fail(state, "Только для длинных видео");
  if (def.shortsOnly && v.type !== "shorts") return fail(state, "Только для Shorts");
  if (def.preOnly && v.status !== "production") return fail(state, "Доступно только до публикации");
  const cost = boostCost(state, key);
  if (state.balance < cost) return fail(state, `Нужно $${cost}`);
  const s = updateVideo({ ...state, balance: state.balance - cost }, id, (x) => ({ ...x, boosts: { ...x.boosts, [key]: true } }));
  return { state: s, ok: true, events: [{ kind: "success", text: `${def.name}: активировано`, sound: "coin" }] };
}

export function buyAdCampaign(state: GameState, id: string, pkgId: string, now: number): ActionResult {
  const v = state.videos.find((x) => x.id === id);
  const pkg = AD_PACKAGES.find((p) => p.id === pkgId);
  if (!v || !pkg) return fail(state, "Ошибка");
  if (state.balance < pkg.cost) return fail(state, `Нужно $${pkg.cost.toLocaleString()}`);
  const pre = v.status === "production";
  const views = adPackageViews(state, v.type, pkg.cost);
  const campaign = {
    id: uid("cmp"),
    name: pkg.name,
    spent: pkg.cost,
    totalViews: views,
    delivered: 0,
    startAt: pre ? 0 : now,
    durationSec: 40,
    prelaunch: pre,
  };
  const s = updateVideo({ ...state, balance: state.balance - pkg.cost }, id, (x) => ({ ...x, campaigns: [...x.campaigns, campaign] }));
  return {
    state: s,
    ok: true,
    events: [{ kind: "money", text: `Реклама «${pkg.name}»: ~${views.toLocaleString()} показов${pre ? " на старте" : ""}`, sound: "coin" }],
  };
}

export function rushProduction(state: GameState, id: string, now: number): ActionResult {
  const v = state.videos.find((x) => x.id === id);
  if (!v || v.status !== "production") return fail(state, "Видео уже опубликовано");
  const cost = rushCost(state, v, now);
  if (state.balance < cost) return fail(state, `Нужно $${cost}`);
  const s = updateVideo({ ...state, balance: state.balance - cost }, id, (x) => ({ ...x, readyAt: now }));
  return { state: s, ok: true, events: [{ kind: "info", text: "Монтаж ускорен, видео выходит", sound: "coin" }] };
}

export function buyUpgrade(state: GameState, id: string): ActionResult {
  const def = getUpgrade(id);
  if (!def) return fail(state, "Нет такого апгрейда");
  const lvl = state.upgrades[id] || 0;
  if (lvl >= def.levels) return fail(state, "Максимальный уровень");
  const cost = upgradeCost(def, lvl);
  if (state.balance < cost) return fail(state, "Недостаточно денег");
  const events: GameEvent[] = [{ kind: "success", text: `${def.name}: уровень ${lvl + 1}, x${upgradeMult(def, lvl + 1)}`, sound: "coin" }];
  let balance = state.balance - cost;
  let step = state.onboardingStep;
  if (step === 4) {
    balance += 100;
    step = 5;
    events.push({ kind: "money", text: "Онбординг: первый апгрейд, +$100" });
  }
  return { state: { ...state, balance, onboardingStep: step, upgrades: { ...state.upgrades, [id]: lvl + 1 } }, ok: true, events };
}

export function hireMember(state: GameState, id: string): ActionResult {
  const m = state.team.find((t) => t.id === id);
  if (!m || m.hired) return fail(state, "Недоступно");
  if (state.balance < m.hireCost) return fail(state, "Недостаточно денег");
  const events: GameEvent[] = [{ kind: "success", text: `${m.name} в команде`, sound: "success" }];
  let balance = state.balance - m.hireCost;
  let step = state.onboardingStep;
  if (step === 5) {
    balance += 200;
    step = 6;
    events.push({ kind: "money", text: "Онбординг: первый сотрудник, +$200" });
  }
  return { state: { ...state, balance, onboardingStep: step, team: state.team.map((t) => (t.id === id ? { ...t, hired: true } : t)) }, ok: true, events };
}

export function acceptAd(state: GameState, id: string): ActionResult {
  const o = state.adOffers.find((x) => x.id === id);
  if (!o || o.status !== "available") return fail(state, "Оффер недоступен");
  const events: GameEvent[] = [{ kind: "money", text: `Контракт с ${o.brand}: +$${o.payout.toLocaleString()}`, sound: "coin" }];
  let balance = state.balance + o.payout;
  let completed = state.onboardingCompleted;
  if (state.onboardingStep === 6 && !completed) {
    balance += 500;
    completed = true;
    events.push({ kind: "money", text: "Онбординг завершён, +$500!", sound: "success" });
  }
  return {
    state: {
      ...state,
      balance,
      onboardingCompleted: completed,
      adOffers: state.adOffers.filter((x) => x.id !== id),
      stats: { ...state.stats, lifetimeEarnings: (state.stats.lifetimeEarnings || 0) + o.payout },
    },
    ok: true,
    events,
  };
}
