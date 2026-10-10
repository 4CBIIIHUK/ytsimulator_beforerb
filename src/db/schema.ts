import { pgTable, text, varchar, integer, timestamp, jsonb, boolean, bigint, doublePrecision } from "drizzle-orm/pg-core";

export const gameSaves = pgTable("game_saves", {
  id: varchar("id", { length: 64 }).primaryKey(),
  balance: doublePrecision("balance").default(500).notNull(),
  channel: jsonb("channel"),
  stats: jsonb("stats").notNull(),
  upgrades: jsonb("upgrades").notNull(),
  team: jsonb("team").notNull(),
  videos: jsonb("videos").notNull(),
  salesHistory: jsonb("sales_history").notNull(),
  adOffers: jsonb("ad_offers").notNull(),
  activeBuyoutOffer: jsonb("active_buyout_offer"),
  onboardingStep: integer("onboarding_step").default(1).notNull(),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  settings: jsonb("settings").notNull(),
  full: jsonb("full"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: varchar("id", { length: 64 }).primaryKey(),
  channelName: text("channel_name").notNull(),
  subscribers: bigint("subscribers", { mode: "number" }).notNull(),
  views: bigint("views", { mode: "number" }).notNull(),
  category: text("category").notNull(),
  brandScore: integer("brand_score").default(50).notNull(),
  isPlayer: boolean("is_player").default(false).notNull(),
  avatarConfig: jsonb("avatar_config"),
  playButton: text("play_button"), // 'silver', 'gold', 'diamond', 'custom', 'red_diamond', 'googol'
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
