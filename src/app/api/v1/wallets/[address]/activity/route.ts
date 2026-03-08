import { NextResponse } from "next/server";
import { z } from "zod";
import { getWalletActivity } from "@/lib/blockchain";
import type { Chain } from "@/types";

const VALID_CHAINS = ["ethereum", "bitcoin", "solana", "polygon", "arbitrum", "base"] as const;

const querySchema = z.object({
  chain: z.enum(VALID_CHAINS).default("ethereum"),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!address || address.length < 10) {
      return NextResponse.json({ error: "Invalid wallet address." }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { chain, limit } = parsed.data;

    const activity = await getWalletActivity(address, chain as Chain);

    // Trim recentTransactions to the requested limit
    const trimmed = {
      ...activity,
      recentTransactions: activity.recentTransactions.slice(0, limit),
    };

    return NextResponse.json({ wallet: trimmed });
  } catch (err) {
    console.error("[GET /api/v1/wallets/[address]/activity]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
