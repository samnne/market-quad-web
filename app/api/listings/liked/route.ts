import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/db/db";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const listings = await prisma.listing.findMany({
    where: {
      archived: false,
      likes: { some: { userId: auth.user.uid } },
    },
    include: {
      seller: true,
      _count: { select: { likes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ listings, success: true });
}