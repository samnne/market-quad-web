import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

import { getUserListings } from "@/db/listings.db";
import { prisma } from "@/db/db";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) {
    return auth.response;
  }
  const uid = auth.user.uid;

  if (!uid) {
    return NextResponse.json({
      message: "Failed to Fetch Get User, no UID",
      status: 500,
      user: null,
      success: false,
    });
  }
  try {
    const user = await prisma.user.findFirst({
      where: { uid: uid },
      include: {
        likes: true,
        preferences: true,
        Blocker: {
          include: {
            blocked: true
          }
        },

      },

    });


    return NextResponse.json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Failed to Fetch User",
      status: 500,
      user: [],
      success: false,
    });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) {
    return auth.response;
  }
  const uid = auth.user.uid;
  if (!uid) {
    return NextResponse.json({
      message: "Failed to Fetch Listings, no UID",
      status: 500,
      listings: [],
      success: false,
    });
  }
  try {
    const listings = await getUserListings(uid);

    return NextResponse.json({
      listings,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Failed to Fetch Listings",
      status: 500,
      listings: [],
      success: false,
    });
  }
}
