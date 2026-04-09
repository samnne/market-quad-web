import { getPreferences } from "@/lib/preferences.lib";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("authorization");
  if (!userId) {
    return NextResponse.json({
      message: "Failed to Fetch Listings, no UID",
      status: 500,
      success: false,
    });
  }
  const { success, preferences } = await getPreferences(userId);

  return NextResponse.json({
    message: "Got Prefs",
    success,
    preferences,
  });
}
