import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateApiKey } from "@/lib/utils";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const newKey = generateApiKey();

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.user.update({ where: { id: session.user.id }, data: { apiKey: newKey } });
    return NextResponse.json({ apiKey: newKey });
  } catch {
    return NextResponse.json({ apiKey: newKey });
  }
}
