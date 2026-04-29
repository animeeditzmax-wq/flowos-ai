import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { createFallbackUser, fallbackUsers } from "@/server/auth/fallback-store";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { name?: string; email?: string; password?: string };
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (!name || !email || password.length < 8) {
      return NextResponse.json({ error: "Name, valid email, and 8+ char password are required." }, { status: 400 });
    }


    if (!process.env.DATABASE_URL) {
      if (fallbackUsers.has(email)) {
        return NextResponse.json({ error: "Account already exists." }, { status: 409 });
      }
      const passwordHash = await bcrypt.hash(password, 12);
      createFallbackUser({ name, email, passwordHash });
      return NextResponse.json({ ok: true, mode: "fallback" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "Account already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { name, email, passwordHash }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed.";
    const dbMissing = message.includes("DATABASE_URL");
    return NextResponse.json({ error: dbMissing ? "Server database is not configured yet. Please add DATABASE_URL in deployment settings or use configured environment." : `Signup failed: ${message}` }, { status: 500 });
  }
}
