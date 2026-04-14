import { prisma } from "@/db/db";
import { requireAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) {
    return auth.response;
  }
  const { userId, token, platform } = await req.json();

  if (!userId || !token) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await prisma.pushToken.upsert({
    where: { userId },
    update: { token, platform },
    create: { userId, token, platform },
  });

  return NextResponse.json({ ok: true });
}
