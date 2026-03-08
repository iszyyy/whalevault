import { v4 as uuidv4 } from "uuid";
import type { WhaleTransaction, WalletActivity, TokenWhaleVolume, MarketSentiment, Chain, TransactionType } from "@/types";

// ─── Address pools ────────────────────────────────────────────────────────────

const ETH_ADDRESSES = [
  { address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", label: "Vitalik Buterin" },
  { address: "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503", label: "Binance Hot Wallet" },
  { address: "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8", label: "Binance Cold Wallet" },
  { address: "0x28C6c06298d514Db089934071355E5743bf21d60", label: "Binance 14" },
  { address: "0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549", label: "Binance 15" },
  { address: "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d", label: "Coinbase 6" },
  { address: "0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43", label: "Coinbase 10" },
  { address: "0x8894E0a0c962CB723c1976a4421c95949bE2D4E3", label: "Binance 8" },
  { address: "0x0548F59fEE79f8832C299e01dCA5c76F034F558e", label: "Unknown Whale 1" },
  { address: "0x4E9ce36E442e55EcD9025B9a6E0D88485d628A67", label: "Unknown Whale 2" },
];

const BTC_ADDRESSES = [
  { address: "1P5ZEDWTKTFGxQjZphgWPQUpe554WKDfHQ", label: "Binance BTC" },
  { address: "34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo", label: "Bitfinex BTC" },
  { address: "3LYJfcfHPXYJreMsASk2jkn69LWEYKzo", label: "Unknown BTC Whale" },
  { address: "bc1qgdjqv0av3q56jvd82tkdjpy7gdp9ut8tlqmgrpmv24sq90ecnvqqjwvw97", label: "Cold Storage" },
];

const SOL_ADDRESSES = [
  { address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM", label: "Binance SOL" },
  { address: "HVh6wHNBAsG3pq1Bj5oCzRjoWKVogEDHwUHkRz3ekFgt", label: "FTX Recovery" },
  { address: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1", label: "Unknown SOL Whale" },
];

const TOKENS: Record<Chain, string[]> = {
  ethereum: ["ETH", "USDC", "USDT", "WBTC", "UNI", "LINK", "AAVE", "MKR", "SNX", "CRV"],
  bitcoin: ["BTC"],
  solana: ["SOL", "USDC", "RAY", "SRM", "ORCA", "BONK", "JTO"],
  polygon: ["MATIC", "USDC", "USDT", "WETH", "QUICK"],
  arbitrum: ["ETH", "ARB", "USDC", "GMX", "RDNT"],
  base: ["ETH", "USDC", "BRETT", "DEGEN"],
};

const TX_TYPES: TransactionType[] = ["transfer", "swap", "stake", "unstake"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAddress(chain: Chain): { address: string; label?: string } {
  if (chain === "bitcoin") return randomChoice(BTC_ADDRESSES);
  if (chain === "solana") return randomChoice(SOL_ADDRESSES);
  return randomChoice(ETH_ADDRESSES);
}

const TOKEN_PRICES: Record<string, number> = {
  ETH: 3_450,
  BTC: 67_200,
  SOL: 185,
  USDC: 1,
  USDT: 1,
  WBTC: 67_200,
  UNI: 12.4,
  LINK: 18.7,
  AAVE: 245,
  MKR: 2_800,
  SNX: 3.2,
  CRV: 0.58,
  MATIC: 0.92,
  ARB: 1.05,
  GMX: 28.4,
  RDNT: 0.18,
  RAY: 1.85,
  SRM: 0.12,
  ORCA: 4.72,
  BONK: 0.0000285,
  JTO: 3.95,
  BRETT: 0.082,
  DEGEN: 0.014,
  QUICK: 0.072,
  WETH: 3_450,
};

function tokenPrice(symbol: string): number {
  return TOKEN_PRICES[symbol] ?? 1;
}

// ─── Generators ───────────────────────────────────────────────────────────────

export function generateMockTransaction(chain?: Chain): WhaleTransaction {
  const selectedChain: Chain = chain ?? (randomChoice(["ethereum", "ethereum", "ethereum", "bitcoin", "solana", "polygon", "arbitrum"]) as Chain);
  const tokens = TOKENS[selectedChain];
  const token = randomChoice(tokens);
  const price = tokenPrice(token);

  // Whale-sized amounts: $100k – $50M
  const usdValue = randomBetween(100_000, 50_000_000);
  const amount = usdValue / price;

  const from = randomAddress(selectedChain);
  let to = randomAddress(selectedChain);
  while (to.address === from.address) {
    to = randomAddress(selectedChain);
  }

  const minutesAgo = randomBetween(0, 120);
  const timestamp = new Date(Date.now() - minutesAgo * 60 * 1000);

  return {
    id: uuidv4(),
    hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    chain: selectedChain,
    fromAddress: from.address,
    toAddress: to.address,
    token,
    amount,
    usdValue,
    timestamp,
    blockNumber: Math.floor(randomBetween(19_000_000, 20_000_000)),
    type: randomChoice(TX_TYPES),
    fromLabel: from.label,
    toLabel: to.label,
  };
}

export function generateMockTransactions(count = 20, chain?: Chain): WhaleTransaction[] {
  return Array.from({ length: count }, () => generateMockTransaction(chain)).sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
}

export function generateMockWalletActivity(address: string, chain: Chain): WalletActivity {
  const addrPool = chain === "bitcoin" ? BTC_ADDRESSES : chain === "solana" ? SOL_ADDRESSES : ETH_ADDRESSES;
  const knownEntry = addrPool.find((a) => a.address === address);
  const tokens = TOKENS[chain].slice(0, 4);

  const topTokens = tokens.map((symbol) => {
    const price = tokenPrice(symbol);
    const amount = randomBetween(10, 100_000);
    return {
      symbol,
      name: symbol,
      amount,
      usdValue: amount * price,
      priceChange24h: randomBetween(-15, 20),
    };
  });

  return {
    address,
    chain,
    label: knownEntry?.label,
    totalVolumeUsd: randomBetween(1_000_000, 500_000_000),
    transactionCount: Math.floor(randomBetween(50, 2_000)),
    lastActive: new Date(Date.now() - randomBetween(0, 3_600_000)),
    topTokens,
    recentTransactions: generateMockTransactions(5, chain),
  };
}

export function generateMockTokenWhaleVolumes(): TokenWhaleVolume[] {
  const tokens = ["ETH", "BTC", "SOL", "USDC", "LINK", "UNI", "AAVE", "ARB", "MATIC", "GMX"];
  return tokens.map((symbol) => ({
    symbol,
    name: symbol,
    totalVolumeUsd: randomBetween(10_000_000, 2_000_000_000),
    transactionCount: Math.floor(randomBetween(100, 5_000)),
    uniqueWhales: Math.floor(randomBetween(10, 500)),
    priceChange24h: randomBetween(-20, 25),
    sentiment: (randomBetween(0, 1) > 0.5 ? "bullish" : randomBetween(0, 1) > 0.5 ? "bearish" : "neutral") as "bullish" | "bearish" | "neutral",
  }));
}

export function generateMockMarketSentiment(): MarketSentiment {
  const score = Math.floor(randomBetween(20, 85));
  const overall = score > 60 ? "bullish" : score < 40 ? "bearish" : "neutral";
  const topMovers = generateMockTokenWhaleVolumes().slice(0, 5);

  return {
    overall,
    score,
    fearGreedIndex: Math.floor(randomBetween(15, 90)),
    dominantChain: "ethereum",
    topMovers,
    updatedAt: new Date(),
  };
}
