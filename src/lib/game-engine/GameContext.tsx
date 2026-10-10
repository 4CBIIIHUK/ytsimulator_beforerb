"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  GameState,
  AvatarConfig,
  BannerConfig,
  SoldChannelRecord,
  GameEvent,
  BoostKey,
  Modifiers,
} from "@/types/game";
import { INITIAL_BALANCE, INITIAL_TEAM, AD_BRANDS } from "./constants";
import { calculateBrandScore } from "@/lib/scoring/brand-score";
import { sound } from "./sound";
import * as E from "./engine";

export interface Toast extends GameEvent {
  id: string;
  at: number;
}

type Res = { ok: boolean; error?: string };

interface GameContextType {
  state: GameState;
  isLoaded: boolean;
  now: number;
  mods: Modifiers;
  toasts: Toast[];
  dismissToast: (id: string) => void;
  createChannel: (name: string, topic: string, description: string, avatar: AvatarConfig, banner: BannerConfig) => { success: boolean; error?: string };
  updateChannelDesign: (avatar: AvatarConfig, banner: BannerConfig, description?: string) => { success: boolean; error?: string };
  startProduction: (form: E.ProductionForm) => Res & { videoId?: string };
  buyThumbnail: (videoId: string, tier: number) => Res;
  buyBoost: (videoId: string, key: BoostKey) => Res;
  buyAdCampaign: (videoId: string, pkgId: string) => Res;
  rushProduction: (videoId: string) => Res;
  buyUpgrade: (upgradeId: string) => boolean;
  buyUpgradeMax: (upgradeId: string) => number;
  hireTeamMember: (memberId: string) => boolean;
  fireTeamMember: (memberId: string) => boolean;
  acceptAdOffer: (offerId: string) => boolean;
  declineAdOffer: (offerId: string) => void;
  acceptBuyoutOffer: () => SoldChannelRecord | null;
  declineBuyoutOffer: () => void;
  negotiateBuyoutOffer: () => { success: boolean; walkedAway: boolean; newPrice?: number };
  advanceOnboarding: (stepNumber: number) => void;
  triggerManualBuyoutOffer: () => void;
  resetGame: () => void;
  toggleSound: () => void;
  addBalance: (amount: number) => void;
  timeUntilNextBuyoutCheck: number;
  activeBuyoutCountdown: number;
}

const STORAGE_KEY = "yt_sim_v4_state";
const VERSION = 4;

function makeDefaultState(): GameState {
  const now = Date.now();
  return {
    version: VERSION,
    balance: INITIAL_BALANCE,
    channel: null,
    stats: {
      subscribers: 0,
      totalViews: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      revenuePerSec: 0,
      viewsPerSec: 0,
      subsPerSec: 0,
      videosCreated: 0,
      soldChannelsCount: 0,
      prestigeBonus: 0,
      lifetimeEarnings: 0,
    },
    upgrades: {},
    team: INITIAL_TEAM,
    videos: [],
    adOffers: [],
    trends: E.initialTrends(),
    activeBuyoutOffer: null,
    salesHistory: [],
    onboardingStep: 1,
    onboardingCompleted: false,
    settings: { soundEnabled: true, autoSave: true, gameSpeed: 1 },
    lastTickTime: now,
    nextBuyoutAt: now + E.rand(150, 210) * 1000,
    buyoutTickCounter: 0,
    nextAdOfferAt: now + 30000,
    networks: {},
  };
}

function onboardingOffer(now: number) {
  return {
    id: E.uid("ad"),
    brand: AD_BRANDS[0].brand,
    productDesc: "Стартовый контракт для новых авторов",
    requirementSubs: 0,
    payout: 150,
    repRequired: 0,
    contractLengthVideos: 1,
    progressVideos: 0,
    status: "available" as const,
    expiresAt: now + 30 * 60 * 1000,
  };
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => makeDefaultState());
  const stateRef = useRef<GameState>(state);
  const [isLoaded, setIsLoaded] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushEvents = useCallback((events: GameEvent[]) => {
    if (!events.length) return;
    const at = Date.now();
    const newToasts = events.map((e) => ({ ...e, id: E.uid("t"), at }));
    setToasts((prev) => [...newToasts, ...prev].slice(0, 5));
    const withSound = events.find((e) => e.sound);
    if (withSound?.sound === "coin") sound.playCoin();
    else if (withSound?.sound === "success") sound.playSuccess();
    else if (withSound?.sound === "alert") sound.playAlert();
  }, []);

  const commit = useCallback((s: GameState) => {
    stateRef.current = s;
    setState(s);
  }, []);

  const run = useCallback(
    (fn: (s: GameState) => E.ActionResult): E.ActionResult => {
      const r = fn(stateRef.current);
      if (r.ok) commit(r.state);
      if (r.events.length) pushEvents(r.events);
      if (!r.ok && r.error) pushEvents([{ kind: "warning", text: r.error }]);
      return r;
    },
    [commit, pushEvents]
  );

  const dismissToast = useCallback((id: string) => setToasts((p) => p.filter((t) => t.id !== id)), []);

  // auto-dismiss toasts
  useEffect(() => {
    if (!toasts.length) return;
    const t = setTimeout(() => {
      const cutoff = Date.now() - 4500;
      setToasts((p) => p.filter((x) => x.at > cutoff));
    }, 1000);
    return () => clearTimeout(t);
  }, [toasts]);

  // load
  useEffect(() => {
    let loaded: GameState | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === VERSION) loaded = parsed;
      }
    } catch {
      /* ignore */
    }

    const finish = (s: GameState | null) => {
      const n = Date.now();
      if (s) {
        const off = E.simulateOffline(s, n);
        commit(off.state);
        sound.setEnabled(off.state.settings?.soundEnabled ?? true);
        if (off.earned > 1) {
          pushEvents([{ kind: "money", text: `Офлайн-доход за ${Math.round(off.seconds / 60)} мин: +$${Math.round(off.earned).toLocaleString()}`, sound: "coin" }]);
        }
      }
      setIsLoaded(true);
    };

    if (loaded) {
      finish(loaded);
      return;
    }
    fetch("/api/game/load?slotId=v4_player")
      .then((r) => r.json())
      .then((json) => {
        const d = json?.data?.full;
        finish(d && d.version === VERSION ? d : null);
      })
      .catch(() => finish(null));
  }, [commit, pushEvents]);

  // main loop
  useEffect(() => {
    if (!isLoaded) return;
    const iv = setInterval(() => {
      const n = Date.now();
      const prev = stateRef.current;
      const dt = Math.min(5, Math.max(0.2, (n - prev.lastTickTime) / 1000));
      const r = E.tick(prev, n, dt);
      commit(r.state);
      setNow(n);
      pushEvents(r.events);
    }, 1000);
    return () => clearInterval(iv);
  }, [isLoaded, commit, pushEvents]);

  // persist local
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota */
    }
  }, [state, isLoaded]);

  // server sync
  useEffect(() => {
    if (!isLoaded) return;
    const iv = setInterval(() => {
      const s = stateRef.current;
      fetch("/api/game/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: "v4_player", ...s, full: s }),
      }).catch(() => {});
    }, 30000);
    return () => clearInterval(iv);
  }, [isLoaded]);

  const mods = useMemo(() => E.computeModifiers(state), [state]);

  // ------------------------------------------------------------- actions
  const createChannel = useCallback(
    (name: string, topic: string, description: string, avatar: AvatarConfig, banner: BannerConfig) => {
      const trimmed = name.trim();
      if (trimmed.length < 3 || trimmed.length > 30) return { success: false, error: "Название канала должно быть от 3 до 30 символов" };
      const sc = calculateBrandScore(trimmed, topic, description, avatar, banner);
      const s = stateRef.current;
      const n = Date.now();
      const isFirst = s.onboardingStep === 1;
      commit({
        ...s,
        channel: {
          name: trimmed,
          topic,
          avatar,
          banner,
          description: description.trim(),
          links: ["https://youtube.com/@" + trimmed.toLowerCase().replace(/\s+/g, "")],
          brandScore: sc.totalBrandScore,
          avatarScore: sc.avatarScore,
          bannerScore: sc.bannerScore,
          descriptionScore: sc.descriptionScore,
          nameScore: sc.nameScore,
          level: 1,
          reputation: 5,
          createdAt: n,
          lastRedesignedAt: n,
        },
        onboardingStep: isFirst ? 2 : s.onboardingStep,
        adOffers: s.onboardingCompleted ? s.adOffers : [onboardingOffer(n), ...s.adOffers],
        nextAdOfferAt: n + 30000,
      });
      pushEvents([{ kind: "success", text: `Канал «${trimmed}» создан. Brand Score ${sc.totalBrandScore}`, sound: "success" }]);
      return { success: true };
    },
    [commit, pushEvents]
  );

  const updateChannelDesign = useCallback(
    (avatar: AvatarConfig, banner: BannerConfig, description?: string) => {
      const s = stateRef.current;
      if (!s.channel) return { success: false, error: "Канал не существует" };
      const cooldown = 30000 - (Date.now() - s.channel.lastRedesignedAt);
      if (cooldown > 0) return { success: false, error: `Переоформление доступно через ${Math.ceil(cooldown / 1000)} сек` };
      if (s.balance < 50) return { success: false, error: "Недостаточно средств ($50)" };
      const desc = description ?? s.channel.description;
      const sc = calculateBrandScore(s.channel.name, s.channel.topic, desc, avatar, banner);
      commit({
        ...s,
        balance: s.balance - 50,
        channel: {
          ...s.channel,
          avatar,
          banner,
          description: desc,
          brandScore: sc.totalBrandScore,
          avatarScore: sc.avatarScore,
          bannerScore: sc.bannerScore,
          descriptionScore: sc.descriptionScore,
          lastRedesignedAt: Date.now(),
        },
      });
      pushEvents([{ kind: "success", text: `Ребрендинг завершён. Brand Score ${sc.totalBrandScore}`, sound: "success" }]);
      return { success: true };
    },
    [commit, pushEvents]
  );

  const startProduction = useCallback(
    (form: E.ProductionForm) => {
      const r = E.startProduction(stateRef.current, form, Date.now());
      if (r.ok) commit(r.state);
      pushEvents(r.events);
      return { ok: r.ok, error: r.error, videoId: r.videoId };
    },
    [commit, pushEvents]
  );

  const buyThumbnail = useCallback((id: string, tier: number) => run((s) => E.buyThumbnail(s, id, tier)), [run]);
  const buyBoost = useCallback((id: string, key: BoostKey) => run((s) => E.buyBoost(s, id, key)), [run]);
  const buyAdCampaign = useCallback((id: string, pkg: string) => run((s) => E.buyAdCampaign(s, id, pkg, Date.now())), [run]);
  const rushProduction = useCallback((id: string) => run((s) => E.rushProduction(s, id, Date.now())), [run]);
  const buyUpgrade = useCallback((id: string) => run((s) => E.buyUpgrade(s, id)).ok, [run]);
  const buyUpgradeMax = useCallback(
    (id: string) => {
      let s = stateRef.current;
      let count = 0;
      const extra: GameEvent[] = [];
      for (let i = 0; i < 100; i++) {
        const r = E.buyUpgrade(s, id);
        if (!r.ok) break;
        s = r.state;
        count++;
        extra.push(...r.events.filter((e) => e.kind === "money"));
      }
      if (count > 0) {
        commit(s);
        pushEvents([{ kind: "success", text: `Куплено уровней: ${count}`, sound: "coin" }, ...extra]);
      }
      return count;
    },
    [commit, pushEvents]
  );
  const hireTeamMember = useCallback((id: string) => run((s) => E.hireMember(s, id)).ok, [run]);
  const fireTeamMember = useCallback(
    (id: string) => {
      const s = stateRef.current;
      commit({ ...s, team: s.team.map((t) => (t.id === id ? { ...t, hired: false } : t)) });
      return true;
    },
    [commit]
  );
  const acceptAdOffer = useCallback((id: string) => run((s) => E.acceptAd(s, id)).ok, [run]);
  const declineAdOffer = useCallback(
    (id: string) => {
      const s = stateRef.current;
      commit({ ...s, adOffers: s.adOffers.filter((o) => o.id !== id) });
    },
    [commit]
  );

  const acceptBuyoutOffer = useCallback((): SoldChannelRecord | null => {
    const s = stateRef.current;
    const offer = s.activeBuyoutOffer;
    if (!offer || offer.status !== "active" || !s.channel) return null;
    const rec: SoldChannelRecord = {
      id: E.uid("sold"),
      channelName: s.channel.name,
      buyerName: offer.buyerName,
      price: offer.currentOfferPrice,
      subscribers: Math.floor(s.stats.subscribers),
      views: Math.floor(s.stats.totalViews),
      brandScore: s.channel.brandScore,
      soldAt: Date.now(),
    };
    const history = [rec, ...s.salesHistory];
    commit({
      ...s,
      balance: s.balance + offer.currentOfferPrice,
      channel: null,
      videos: [],
      upgrades: {},
      team: s.team.map((t) => ({ ...t, hired: false })),
      adOffers: [],
      activeBuyoutOffer: null,
      salesHistory: history,
      stats: {
        ...s.stats,
        subscribers: 0,
        totalViews: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        revenuePerSec: 0,
        viewsPerSec: 0,
        subsPerSec: 0,
        videosCreated: 0,
        soldChannelsCount: history.length,
        prestigeBonus: history.length * 0.1,
      },
    });
    pushEvents([{ kind: "money", text: `Канал продан за $${offer.currentOfferPrice.toLocaleString()}!`, sound: "success" }]);
    return rec;
  }, [commit, pushEvents]);

  const declineBuyoutOffer = useCallback(() => {
    commit({ ...stateRef.current, activeBuyoutOffer: null });
  }, [commit]);

  const negotiateBuyoutOffer = useCallback(() => {
    const s = stateRef.current;
    const o = s.activeBuyoutOffer;
    if (!o || o.status !== "active") return { success: false, walkedAway: false };
    if (Math.random() < 0.3) {
      commit({ ...s, activeBuyoutOffer: null });
      sound.playAlert();
      return { success: false, walkedAway: true };
    }
    const newPrice = Math.max(500, Math.round(o.currentOfferPrice * (1 + E.rand(-0.2, 0.2))));
    commit({ ...s, activeBuyoutOffer: { ...o, currentOfferPrice: newPrice, negotiatedCount: o.negotiatedCount + 1 } });
    sound.playCoin();
    return { success: true, walkedAway: false, newPrice };
  }, [commit]);

  const triggerManualBuyoutOffer = useCallback(() => {
    const s = stateRef.current;
    if (!s.channel || s.stats.subscribers < 100 || s.activeBuyoutOffer?.status === "active") {
      pushEvents([{ kind: "warning", text: "Покупатели интересуются каналами от 100 подписчиков" }]);
      return;
    }
    const o = E.makeBuyoutOffer(s, Date.now());
    if (o) {
      commit({ ...s, activeBuyoutOffer: o });
      pushEvents([{ kind: "money", text: `${o.buyerName} прислал оффер`, sound: "alert" }]);
    }
  }, [commit, pushEvents]);

  const advanceOnboarding = useCallback(
    (step: number) => {
      const s = stateRef.current;
      commit({ ...s, onboardingStep: Math.min(6, step), onboardingCompleted: step > 6 });
    },
    [commit]
  );

  const addBalance = useCallback(
    (amount: number) => {
      const s = stateRef.current;
      commit({ ...s, balance: Math.max(0, s.balance + amount) });
      sound.playCoin();
    },
    [commit]
  );

  const toggleSound = useCallback(() => {
    const s = stateRef.current;
    const v = !s.settings.soundEnabled;
    sound.setEnabled(v);
    commit({ ...s, settings: { ...s.settings, soundEnabled: v } });
  }, [commit]);

  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    commit(makeDefaultState());
  }, [commit]);

  const timeUntilNextBuyoutCheck = Math.max(0, Math.ceil((state.nextBuyoutAt - now) / 1000));
  const activeBuyoutCountdown = state.activeBuyoutOffer ? Math.max(0, Math.ceil((state.activeBuyoutOffer.expiresAt - now) / 1000)) : 60;

  return (
    <GameContext.Provider
      value={{
        state,
        isLoaded,
        now,
        mods,
        toasts,
        dismissToast,
        createChannel,
        updateChannelDesign,
        startProduction,
        buyThumbnail,
        buyBoost,
        buyAdCampaign,
        rushProduction,
        buyUpgrade,
        buyUpgradeMax,
        hireTeamMember,
        fireTeamMember,
        acceptAdOffer,
        declineAdOffer,
        acceptBuyoutOffer,
        declineBuyoutOffer,
        negotiateBuyoutOffer,
        advanceOnboarding,
        triggerManualBuyoutOffer,
        resetGame,
        toggleSound,
        addBalance,
        timeUntilNextBuyoutCheck,
        activeBuyoutCountdown,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
};
