import { NextResponse } from "next/server";
import { getMarketSentiment } from "@/lib/blockchain";

export async function GET() {
  try {
    const sentiment = await getMarketSentiment();

    const label =
      sentiment.overall === "bullish"
        ? "Bullish"
        : sentiment.overall === "bearish"
          ? "Bearish"
          : "Neutral";

    return NextResponse.json({
      score: sentiment.score,
      label,
      fearGreedIndex: sentiment.fearGreedIndex,
      dominantChain: sentiment.dominantChain,
      change24h: parseFloat((Math.random() * 10 - 5).toFixed(2)),
      updatedAt: sentiment.updatedAt,
    });
  } catch (err) {
    console.error("[GET /api/v1/analytics/sentiment]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
