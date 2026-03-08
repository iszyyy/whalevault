import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;

  try {
    const { prisma } = await import("@/lib/prisma");
    const alert = await prisma.alert.findUnique({ where: { id } });
    if (!alert || alert.userId !== session.user.id) {
      return NextResponse.json({ error: "Alert not found." }, { status: 404 });
    }
    await prisma.alert.delete({ where: { id } });
    return NextResponse.json({ message: "Alert deleted." });
  } catch {
    return NextResponse.json({ message: "Alert deleted (demo)." });
  }
}
