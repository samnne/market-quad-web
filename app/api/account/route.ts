import { NextRequest, NextResponse } from "next/server";

import { getUserListings } from "@/db/listings.db";

export async function POST(req: NextRequest) {
  const userId = req.headers.get("authorization");
  const uid = await req.json();


  if (!userId) {
    return NextResponse.json({
      message: "Failed to Fetch Listings, no UID",
      status: 500,
      listings: [],
      success: false,
    });
  }
  try {
    const listings = await getUserListings(userId);

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
