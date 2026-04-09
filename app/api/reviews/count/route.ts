
import { updateReviewCount } from "@/db/reviews.db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userID = req.headers.get("authorization");

  if (!userID) {
    return NextResponse.json({
      message: "Must be Authorized",
      success: false,
    });
  }

  const { user, rating, count } = await updateReviewCount(userID);

  return NextResponse.json({
    message: "Successfully calculated rating",
    user,
    rating,
    count
  });
}
