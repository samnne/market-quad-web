"use server";

import { prisma } from "@/db/db";

export type PreferencesPayload = {
  defaultCategory?: string | null;
  defaultCondition?: string | null;
  defaultLocation?: string | null;
  defaultLat?: number | null;
  defaultLng?: number | null;
};

export async function getPreferences(userId: string) {
  try {
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId },
    });
    return { success: true, preferences };
  } catch (err) {
    console.error("Error fetching preferences:", err);
    return { success: false, preferences: null };
  }
}

export async function upsertPreferences(
  userId: string,
  data: PreferencesPayload,
) {
  try {
    const preferences = await prisma.userPreferences.upsert({
      where: { userId },
      update: { ...data },
      create: { userId, ...data },
    });
    return { success: true, preferences };
  } catch (err) {
    console.error("Error upserting preferences:", err);
    return { success: false, preferences: null };
  }
}