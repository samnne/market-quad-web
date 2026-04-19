import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/db/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ lid: string }> },
) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const userId = auth.user.uid;
  const {lid} = await params;

  const existing = await prisma.like.findUnique({
    where: { userId_listingId: { userId, listingId: lid } },
  });

  if (existing) {
    await prisma.like.delete({
      where: { userId_listingId: { userId, listingId: lid } },
    });
    return NextResponse.json({ liked: false });
  }

  await prisma.like.create({ data: { userId, listingId: lid } });
  return NextResponse.json({ liked: true });
}
