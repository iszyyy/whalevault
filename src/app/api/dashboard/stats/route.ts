import { NextResponse } from "next/server";
import { getRecentTransactions, getTopTokensByWhaleVolume, getMarketSentiment } from "@/lib/blockchain";

export async function GET() {
  try {
    const [transactions, tokens, sentiment] = await Promise.all([
      getRecentTransactions({ limit: 50 }),
      getTopTokensByWhaleVolume(),
      getMarketSentiment(),
    ]);

    const totalVolume = transactions.reduce((sum, tx) => sum + tx.usdValue, 0);
    const sorted = [...tokens].sort((a, b) => b.priceChange24h - a.priceChange24h);

    return NextResponse.json({
      totalVolumeTracked: totalVolume,
      activeWhaleWallets: new Set([
        ...transactions.map((t) => t.fromAddress),
        ...transactions.map((t) => t.toAddress),
      ]).size,
      alertsTriggered24h: Math.floor(Math.random() * 120) + 30,
      recentTransactions: transactions.slice(0, 10),
      topTokens: tokens.slice(0, 5),
      topGainer: sorted[0] ?? null,
      topLoser: sorted[sorted.length - 1] ?? null,
      sentiment: {
        score: sentiment.score,
        label: sentiment.overall,
        fearGreedIndex: sentiment.fearGreedIndex,
      },
    });
  } catch (err) {
    console.error("[GET /api/dashboard/stats]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
