import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

const alertSchema = z.object({
  type: z.enum(["large_transaction", "wallet_activity", "token_accumulation", "price_impact", "new_whale_wallet"]),
  config: z.object({
    thresholdUsd: z.number().optional(),
    walletAddress: z.string().optional(),
    chain: z.enum(["ethereum", "bitcoin", "solana", "polygon", "arbitrum", "base"]).optional(),
    token: z.string().optional(),
    percentageChange: z.number().optional(),
    webhookUrl: z.string().url().optional(),
  }),
  deliveryMethod: z.array(z.enum(["email", "telegram", "webhook", "in_app"])).default(["in_app"]),
});

// In-memory store for demo
const mockAlerts: Record<string, unknown[]> = {};

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const { prisma } = await import("@/lib/prisma");
    const alerts = await prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ alerts });
  } catch {
    return NextResponse.json({ alerts: mockAlerts[userId] ?? [] });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await req.json().catch(() => null);
  const parsed = alertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request.", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const alert = await prisma.alert.create({
      data: { userId, type: parsed.data.type, config: parsed.data.config, deliveryMethod: parsed.data.deliveryMethod },
    });
    return NextResponse.json({ alert }, { status: 201 });
  } catch {
    const alert = { id: crypto.randomUUID(), userId, ...parsed.data, active: true, createdAt: new Date(), updatedAt: new Date() };
    mockAlerts[userId] = [...(mockAlerts[userId] ?? []), alert];
    return NextResponse.json({ alert }, { status: 201 });
  }
}
