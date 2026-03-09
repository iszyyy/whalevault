import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { generateApiKey } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);
    const apiKey = generateApiKey();

    const { prisma } = await import("@/lib/prisma");

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: name?.trim() || null,
        email: normalizedEmail,
        password: hashedPassword,
        role: "user",
        subscriptionTier: "free",
        apiKey,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptionTier: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ message: "Account created successfully.", user }, { status: 201 });
  } catch (err) {
    console.error("[register] Unexpected error:", err);
    return NextResponse.json(
      {
        error:
          "Unable to create account right now. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}
