import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  try {
    const { createBillingPortalSession } = await import("@/lib/stripe");
    const { prisma } = await import("@/lib/prisma");

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: "No billing account found." }, { status: 404 });
    }

    const portalSession = await createBillingPortalSession(
      user.stripeCustomerId,
      `${origin}/dashboard/settings`
    );

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("[stripe/portal]", err);
    return NextResponse.json({ error: "Failed to create portal session." }, { status: 500 });
  }
}
