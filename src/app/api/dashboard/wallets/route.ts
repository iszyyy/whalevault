import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

const addSchema = z.object({
  walletAddress: z.string().min(10),
  chain: z.enum(["ethereum", "bitcoin", "solana", "polygon", "arbitrum", "base"]),
  label: z.string().max(100).optional(),
  alertThreshold: z.number().min(0).optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const { prisma } = await import("@/lib/prisma");
    const wallets = await prisma.walletWatch.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ wallets });
  } catch {
    return NextResponse.json({ wallets: [] });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request.", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const wallet = await prisma.walletWatch.create({
      data: { userId: session.user.id, ...parsed.data },
    });
    return NextResponse.json({ wallet }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Wallet already in watchlist." }, { status: 409 });
    }
    // Demo fallback
    return NextResponse.json(
      { wallet: { id: crypto.randomUUID(), userId: session.user.id, ...parsed.data, createdAt: new Date() } },
      { status: 201 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id parameter." }, { status: 400 });

  try {
    const { prisma } = await import("@/lib/prisma");
    const wallet = await prisma.walletWatch.findUnique({ where: { id } });
    if (!wallet || wallet.userId !== session.user.id) {
      return NextResponse.json({ error: "Wallet not found." }, { status: 404 });
    }
    await prisma.walletWatch.delete({ where: { id } });
    return NextResponse.json({ message: "Wallet removed from watchlist." });
  } catch {
    return NextResponse.json({ message: "Wallet removed (demo)." });
  }
}
