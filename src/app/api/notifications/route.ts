import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
}

// In-memory queue for demo
const notificationStore: Map<string, Notification[]> = new Map();

const DEMO_NOTIFICATIONS: Omit<Notification, "id" | "userId">[] = [
  { title: "Whale Alert", body: "0xd8dA...6045 transferred $2.4M USDC", read: false, createdAt: new Date(Date.now() - 300_000) },
  { title: "Price Alert", body: "ETH whale accumulation detected (+15%)", read: false, createdAt: new Date(Date.now() - 900_000) },
  { title: "New Transaction", body: "Large BTC transfer: 500 BTC (~$33.6M)", read: true, createdAt: new Date(Date.now() - 3_600_000) },
];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const userId = session.user.id;
  if (!notificationStore.has(userId)) {
    notificationStore.set(
      userId,
      DEMO_NOTIFICATIONS.map((n) => ({ ...n, id: crypto.randomUUID(), userId }))
    );
  }

  return NextResponse.json({ notifications: notificationStore.get(userId) });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body = await req.json().catch(() => ({})) as { title?: string; body?: string };
  if (!body.title || !body.body) {
    return NextResponse.json({ error: "title and body are required." }, { status: 400 });
  }

  const userId = session.user.id;
  const notification: Notification = {
    id: crypto.randomUUID(),
    userId,
    title: body.title,
    body: body.body,
    read: false,
    createdAt: new Date(),
  };

  const existing = notificationStore.get(userId) ?? [];
  notificationStore.set(userId, [notification, ...existing]);

  return NextResponse.json({ notification }, { status: 201 });
}
