import { NextResponse } from "next/server";
import { z } from "zod";
import { getTopTokensByWhaleVolume } from "@/lib/blockchain";

const querySchema = z.object({
  period: z.enum(["24h", "7d", "30d"]).default("24h"),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { period } = parsed.data;

    const tokens = await getTopTokensByWhaleVolume();

    // Scale volumes by period multiplier to simulate different time windows
    const multiplier = period === "24h" ? 1 : period === "7d" ? 7 : 30;
    const scaled = tokens.map((t) => ({
      token: t.symbol,
      name: t.name,
      chain: "ethereum" as const,
      volume: t.totalVolumeUsd * multiplier,
      usdVolume: t.totalVolumeUsd * multiplier,
      change24h: t.priceChange24h,
      transactionCount: t.transactionCount * multiplier,
      uniqueWhales: t.uniqueWhales,
      sentiment: t.sentiment,
    }));

    return NextResponse.json({ tokens: scaled, period });
  } catch (err) {
    console.error("[GET /api/v1/analytics/top-tokens]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
