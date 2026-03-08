import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getRecentTransactions } from "@/lib/blockchain";
import { rateLimit } from "@/lib/redis";
import { PLANS } from "@/lib/stripe";
import type { Chain, UserPlan } from "@/types";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  chain: z.enum(["ethereum", "bitcoin", "solana", "polygon", "arbitrum", "base"]).optional(),
  min_amount: z.coerce.number().min(0).default(100_000),
});

async function resolveUserTier(req: Request): Promise<{ userId: string; tier: UserPlan } | null> {
  // Try API key header first
  const apiKey = req.headers.get("X-API-Key");
  if (apiKey) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const user = await prisma.user.findUnique({
        where: { apiKey },
        select: { id: true, subscriptionTier: true },
      });
      if (user) {
        return { userId: user.id, tier: user.subscriptionTier as UserPlan };
      }
    } catch {
      // DB unavailable – treat as free tier for demo
      return { userId: `key:${apiKey}`, tier: "free" };
    }
  }

  // Try Bearer token / session
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return { userId: session.user.id, tier: session.user.subscriptionTier };
  }

  return null;
}

export async function GET(req: Request) {
  try {
    const auth = await resolveUserTier(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized. Provide X-API-Key header or a valid session." },
        { status: 401 }
      );
    }

    const { userId, tier } = auth;
    const dailyLimit = PLANS[tier].limits.apiRequestsPerDay;

    // Rate limiting (fail-open when Redis unavailable)
    if (dailyLimit > 0) {
      const rl = await rateLimit(`v1:tx:${userId}`, dailyLimit, 86_400);
      if (!rl.allowed) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Upgrade your plan for higher limits." },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": String(dailyLimit),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": String(rl.resetAt),
            },
          }
        );
      }
    }

    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { page, limit, chain, min_amount } = parsed.data;

    const transactions = await getRecentTransactions({
      chain: chain as Chain | undefined,
      minUsdValue: min_amount,
      limit: limit * page, // fetch enough to paginate
    });

    const start = (page - 1) * limit;
    const paginated = transactions.slice(start, start + limit);
    const total = transactions.length;

    return NextResponse.json({
      transactions: paginated,
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error("[GET /api/v1/transactions]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
