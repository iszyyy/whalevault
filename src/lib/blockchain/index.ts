import type { WhaleTransaction, WalletActivity, TokenWhaleVolume, MarketSentiment, Chain } from "@/types";
import {
  generateMockTransactions,
  generateMockWalletActivity,
  generateMockTokenWhaleVolumes,
  generateMockMarketSentiment,
} from "./mock-data";

const isDemoMode = (): boolean =>
  process.env.DEMO_MODE === "true" ||
  !process.env.MORALIS_API_KEY ||
  !process.env.ETHERSCAN_API_KEY;

// ─── Real data fetchers (stubs – wire up to actual APIs when keys are present) ─

async function fetchRealRecentTransactions(
  _chain: Chain,
  _minUsdValue: number,
  _limit: number
): Promise<WhaleTransaction[]> {
  // Moralis Whale Transactions endpoint example:
  // GET https://deep-index.moralis.io/api/v2/whales/transactions
  // Wire up when MORALIS_API_KEY is set in production.
  throw new Error("Real blockchain API not yet wired up – set DEMO_MODE=false and provide API keys.");
}

async function fetchRealWalletActivity(_address: string, _chain: Chain): Promise<WalletActivity> {
  throw new Error("Real blockchain API not yet wired up.");
}

async function fetchRealTopTokensByWhaleVolume(): Promise<TokenWhaleVolume[]> {
  throw new Error("Real blockchain API not yet wired up.");
}

async function fetchRealMarketSentiment(): Promise<MarketSentiment> {
  throw new Error("Real blockchain API not yet wired up.");
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getRecentTransactions(
  options: {
    chain?: Chain;
    minUsdValue?: number;
    limit?: number;
  } = {}
): Promise<WhaleTransaction[]> {
  const { chain, minUsdValue = 100_000, limit = 20 } = options;

  if (isDemoMode()) {
    const txs = generateMockTransactions(limit, chain);
    return txs.filter((tx) => tx.usdValue >= minUsdValue);
  }

  return fetchRealRecentTransactions(chain ?? "ethereum", minUsdValue, limit);
}

export async function getWalletActivity(
  address: string,
  chain: Chain = "ethereum"
): Promise<WalletActivity> {
  if (isDemoMode()) {
    return generateMockWalletActivity(address, chain);
  }

  return fetchRealWalletActivity(address, chain);
}

export async function getTopTokensByWhaleVolume(): Promise<TokenWhaleVolume[]> {
  if (isDemoMode()) {
    return generateMockTokenWhaleVolumes();
  }

  return fetchRealTopTokensByWhaleVolume();
}

export async function getMarketSentiment(): Promise<MarketSentiment> {
  if (isDemoMode()) {
    return generateMockMarketSentiment();
  }

  return fetchRealMarketSentiment();
}
