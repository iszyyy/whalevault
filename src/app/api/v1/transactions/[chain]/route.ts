import { NextResponse } from "next/server";
import { z } from "zod";
import { getRecentTransactions } from "@/lib/blockchain";
import type { Chain } from "@/types";

const VALID_CHAINS = ["ethereum", "bitcoin", "solana", "polygon", "arbitrum", "base"] as const;

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  min_amount: z.coerce.number().min(0).default(100_000),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chain: string }> }
) {
  try {
    const { chain } = await params;

    if (!VALID_CHAINS.includes(chain as Chain)) {
      return NextResponse.json(
        {
          error: `Invalid chain "${chain}". Must be one of: ${VALID_CHAINS.join(", ")}.`,
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { page, limit, min_amount } = parsed.data;

    const transactions = await getRecentTransactions({
      chain: chain as Chain,
      minUsdValue: min_amount,
      limit: limit * page,
    });

    const start = (page - 1) * limit;
    const paginated = transactions.slice(start, start + limit);

    return NextResponse.json({
      transactions: paginated,
      total: transactions.length,
      page,
      limit,
      chain,
    });
  } catch (err) {
    console.error("[GET /api/v1/transactions/[chain]]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
