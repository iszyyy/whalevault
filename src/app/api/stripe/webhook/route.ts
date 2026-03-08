import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    console.warn("[stripe/webhook] Stripe not configured – skipping.");
    return NextResponse.json({ received: true });
  }

  const { stripe } = await import("@/lib/stripe");
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature." }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
        if (userId && customerId) {
          await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } });
        }
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? "";
        const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
        if (user) {
          const priceId = sub.items.data[0]?.price?.id;
          const { PLANS } = await import("@/lib/stripe");
          let tier: string = "free";
          for (const [planKey, plan] of Object.entries(PLANS)) {
            if (plan.stripePriceId === priceId) { tier = planKey; break; }
          }
          await prisma.user.update({ where: { id: user.id }, data: { subscriptionTier: tier } });
          const periodStart = (sub as unknown as Record<string, number>)["current_period_start"];
          const periodEnd = (sub as unknown as Record<string, number>)["current_period_end"];
          await prisma.subscription.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              stripeSubscriptionId: sub.id,
              plan: tier,
              status: sub.status,
              currentPeriodStart: new Date((periodStart ?? 0) * 1000),
              currentPeriodEnd: new Date((periodEnd ?? 0) * 1000),
            },
            update: {
              plan: tier,
              status: sub.status,
              currentPeriodStart: new Date((periodStart ?? 0) * 1000),
              currentPeriodEnd: new Date((periodEnd ?? 0) * 1000),
            },
          });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? "";
        const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
        if (user) {
          await prisma.user.update({ where: { id: user.id }, data: { subscriptionTier: "free" } });
          await prisma.subscription.deleteMany({ where: { userId: user.id } });
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id ?? "";
        console.warn(`[stripe/webhook] Payment failed for customer ${customerId}`);
        break;
      }
    }
  } catch (dbErr) {
    console.error("[stripe/webhook] DB error:", dbErr);
    // Still return 200 so Stripe doesn't retry
  }

  return NextResponse.json({ received: true });
}
