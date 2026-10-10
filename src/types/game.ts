export type AvatarShape = "circle" | "square" | "rounded" | "hexagon";

export interface AvatarConfig {
  shape: AvatarShape;
  bgGradient: string;
  eyes: string;
  mouth: string;
  brows: string;
  accessory: string;
  monogram: string;
  textColor: string;
  border: string;
  borderColor: string;
}

export interface BannerConfig {
  bgStyle: string;
  colorA: string;
  colorB: string;
  slogan: string;
  showMascot: boolean;
  mascotType: string;
  socials: {
    youtube: boolean;
    twitter: boolean;
    discord: boolean;
    twitch: boolean;
  };
}

export interface Channel {
  name: string;
  topic: string;
  avatar: AvatarConfig;
  banner: BannerConfig;
  description: string;
  links: string[];
  brandScore: number;
  avatarScore: number;
  bannerScore: number;
  descriptionScore: number;
  nameScore: number;
  level: number;
  reputation: number;
  createdAt: number;
  lastRedesignedAt: number;
}

export interface VideoComment {
  id: string;
  author: string;
  text: string;
  likes: number;
}

export type BoostKey = "titleAB" | "seoPack" | "subtitles" | "endScreen" | "premiere" | "pinnedComment" | "hashtags";

export interface VideoBoosts {
  thumbnailTier: number; // 0..4
  titleAB: boolean;
  seoPack: boolean;
  subtitles: boolean;
  endScreen: boolean;
  premiere: boolean;
  pinnedComment: boolean;
  hashtags: boolean;
}

export interface AdCampaign {
  id: string;
  name: string;
  spent: number;
  totalViews: number;
  delivered: number;
  startAt: number; // 0 = waiting for publish
  durationSec: number;
  prelaunch: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnailText: string;
  topic: string;
  type: "video" | "shorts";
  duration: number; // seconds
  thumbnailStyle: string;
  status: "production" | "published";
  createdAt: number;
  readyAt: number;
  productionMs: number;
  publishedAt: number;
  basePotential: number;
  floor: number;
  goodLength: boolean;
  views: number;
  adViews: number;
  likes: number;
  dislikes: number;
  revenue: number;
  subsGained: number;
  quality: number;
  trendMult: number;
  trendName?: string;
  viralMult: number;
  boosts: VideoBoosts;
  campaigns: AdCampaign[];
  comments: VideoComment[];
  lastVps: number; // views per second last tick
}

export type BuyerLogoType = "omni" | "cyber" | "apex" | "hyperion" | "vanguard" | "googol";

export interface BuyoutOffer {
  id: string;
  buyerName: string;
  buyerLogo: BuyerLogoType;
  basePrice: number;
  currentOfferPrice: number;
  reputationMult: number;
  createdAt: number;
  expiresAt: number;
  durationSec: number;
  conditionText: string;
  negotiatedCount: number;
  status: "active" | "accepted" | "declined" | "expired";
}

export interface SoldChannelRecord {
  id: string;
  channelName: string;
  buyerName: string;
  price: number;
  subscribers: number;
  views: number;
  brandScore: number;
  soldAt: number;
}

export type StatKey =
  | "reach"
  | "ctr"
  | "retention"
  | "cpm"
  | "subs"
  | "speed"
  | "trend"
  | "ads"
  | "tail"
  | "shorts"
  | "longform"
  | "sponsor";

export interface UpgradeDef {
  id: string;
  category: string;
  name: string;
  description: string;
  stat: StatKey;
  levels: number;
  maxMult: number;
  baseCost: number;
  costGrowth: number;
  icon: string;
  tierNames: string[];
}

export interface TeamMember {
  id: string;
  role: "scriptwriter" | "editor" | "designer" | "manager" | "sound";
  name: string;
  level: number;
  salaryPerMin: number;
  bonusDesc: string;
  hired: boolean;
  hireCost: number;
  icon: string;
}

export interface AdOffer {
  id: string;
  brand: string;
  requirementSubs: number;
  payout: number;
  repRequired: number;
  productDesc: string;
  contractLengthVideos: number;
  progressVideos: number;
  status: "available" | "active" | "completed" | "expired";
  expiresAt: number;
}

export interface GameStats {
  subscribers: number;
  totalViews: number;
  totalRevenue: number;
  monthlyRevenue: number;
  revenuePerSec: number;
  viewsPerSec: number;
  subsPerSec: number;
  videosCreated: number;
  soldChannelsCount: number;
  prestigeBonus: number;
  lifetimeEarnings: number;
}

export interface TrendItem {
  id: string;
  topic: string;
  category: string;
  hype: number; // 0-100
  momentum: "up" | "down" | "peak";
  cpmMult: number;
  baseViewsMult: number;
  peakAt: number;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  channelName: string;
  subscribers: number;
  views: number;
  category: string;
  isPlayer: boolean;
  playButton?: "silver" | "gold" | "diamond" | "ruby" | "googol";
  brandScore: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  autoSave: boolean;
  gameSpeed: number;
}

export interface GameState {
  version: number;
  balance: number;
  channel: Channel | null;
  stats: GameStats;
  upgrades: Record<string, number>;
  team: TeamMember[];
  videos: VideoItem[];
  adOffers: AdOffer[];
  trends: TrendItem[];
  activeBuyoutOffer: BuyoutOffer | null;
  salesHistory: SoldChannelRecord[];
  onboardingStep: number;
  onboardingCompleted: boolean;
  settings: GameSettings;
  lastTickTime: number;
  nextBuyoutAt: number;
  buyoutTickCounter: number;
  nextAdOfferAt: number;
  networks: Record<string, boolean>;
}

export interface Modifiers {
  reach: number;
  ctr: number;
  retention: number;
  cpm: number;
  subs: number;
  speed: number;
  trend: number;
  ads: number;
  tail: number;
  shorts: number;
  longform: number;
  sponsor: number;
  brand: number;
  meta: number;
  slots: number;
}

export interface GameEvent {
  kind: "success" | "info" | "warning" | "money";
  text: string;
  sound?: "coin" | "success" | "alert";
}
