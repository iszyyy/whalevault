// ─── Blockchain / Whale Tracking ─────────────────────────────────────────────

export type Chain = "ethereum" | "bitcoin" | "solana" | "polygon" | "arbitrum" | "base";

export type TransactionType = "transfer" | "swap" | "stake" | "unstake" | "mint" | "burn";

export interface WhaleTransaction {
  id: string;
  hash: string;
  chain: Chain;
  fromAddress: string;
  toAddress: string;
  token: string;
  amount: number;
  usdValue: number;
  timestamp: Date;
  blockNumber?: number;
  type: TransactionType;
  fromLabel?: string;
  toLabel?: string;
}

export interface WalletActivity {
  address: string;
  chain: Chain;
  label?: string;
  totalVolumeUsd: number;
  transactionCount: number;
  lastActive: Date;
  topTokens: TokenHolding[];
  recentTransactions: WhaleTransaction[];
}

export interface TokenHolding {
  symbol: string;
  name: string;
  amount: number;
  usdValue: number;
  priceChange24h: number;
  logoUrl?: string;
}

export interface TokenWhaleVolume {
  symbol: string;
  name: string;
  totalVolumeUsd: number;
  transactionCount: number;
  uniqueWhales: number;
  priceChange24h: number;
  sentiment: "bullish" | "bearish" | "neutral";
}

export interface MarketSentiment {
  overall: "bullish" | "bearish" | "neutral";
  score: number; // 0-100, >60 bullish, <40 bearish
  fearGreedIndex: number;
  dominantChain: Chain;
  topMovers: TokenWhaleVolume[];
  updatedAt: Date;
}

// ─── Alerts ──────────────────────────────────────────────────────────────────

export type AlertType =
  | "large_transaction"
  | "wallet_activity"
  | "token_accumulation"
  | "price_impact"
  | "new_whale_wallet";

export type DeliveryMethod = "email" | "telegram" | "webhook" | "in_app";

export interface AlertConfig {
  type: AlertType;
  thresholdUsd?: number;
  walletAddress?: string;
  chain?: Chain;
  token?: string;
  percentageChange?: number;
  webhookUrl?: string;
}

export interface AlertWithHistory {
  id: string;
  userId: string;
  type: AlertType;
  config: AlertConfig;
  deliveryMethod: DeliveryMethod[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  triggerCount: number;
  lastTriggeredAt?: Date;
}

// ─── Subscription / Billing ───────────────────────────────────────────────────

export type UserPlan = "free" | "pro" | "enterprise";

export interface PlanFeatures {
  name: string;
  tier: UserPlan;
  priceMonthly: number;
  priceAnnual: number;
  stripePriceId: string | null;
  limits: {
    walletWatches: number;
    alertsPerDay: number;
    apiRequestsPerDay: number;
    historicalDataDays: number;
    exchangeConnections: number;
  };
  features: string[];
}

// ─── Exchange / Trading ───────────────────────────────────────────────────────

export type TradeSide = "buy" | "sell";

export type TradeStatus = "pending" | "open" | "filled" | "cancelled" | "failed";

export interface TradeOrder {
  exchange: string;
  pair: string;
  side: TradeSide;
  amount: number;
  price: number;
  type: "market" | "limit";
}

export interface TradeResult {
  orderId: string;
  exchange: string;
  pair: string;
  side: TradeSide;
  amount: number;
  price: number;
  status: TradeStatus;
  filledAt?: Date;
  fee?: number;
  feeAsset?: string;
}

export interface ExchangeBalance {
  asset: string;
  free: number;
  locked: number;
  usdValue: number;
}

// ─── API / Auth ───────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: string;
  subscriptionTier: UserPlan;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalVolumeTracked: number;
  activeWhaleWallets: number;
  alertsTriggered24h: number;
  topGainer: TokenWhaleVolume | null;
  topLoser: TokenWhaleVolume | null;
}
