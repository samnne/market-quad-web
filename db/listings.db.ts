"use server";
import { prisma } from "./db";

import { ListingWithIncludes } from "@/app/types";

function scoreListings(listings: ListingWithIncludes[], userId?: string) {
  const now = Date.now();

  return listings
    .map((l) => {
      const ageHours = (now - new Date(l.createdAt).getTime()) / 36e5;
      const likeCount = l.likes?.length ?? 0;
      const messageCount = l._count?.conversations ?? 0;
      const hasImage = (l.imageUrls?.length ?? 0) > 0 ? 1 : 0;

      const score =
        likeCount * 3 + messageCount * 2 + hasImage * 5 - ageHours * 0.5;

      return { ...l, _score: score };
    })
    .sort((a, b) => b._score - a._score);
}
export async function getListings({
  cursor,
  userId,
  userCategories = [],
  seenIds = [],
}: {
  cursor?: string;
  userId?: string;
  userCategories?: string[];
  seenIds?: string[];
}): Promise<{ listings: ListingWithIncludes[]; nextCursor: string | null }> {
  const take = 50;

  const raw = await prisma.listing.findMany({
    take: take + 1,
    ...(cursor && { cursor: { lid: cursor }, skip: 1 }),
    where: {
      archived: false,
      sold: false,

      sellerId: { not: userId },
      hidden: false,
      seller: {
        Blocked: {
          none: {
            blockerId: userId,
          },
        },
      },

      ...(userId && { sellerId: { not: userId } }),
      ...(seenIds.length && { lid: { notIn: seenIds } }),
    },
    orderBy: [{ likes: { _count: "desc" } }, { createdAt: "desc" }],
    include: {
      seller: {
        include: {
          reportsFiled: true,
          Blocked: true,
          pushToken: true
        },
      },
      conversations: userId
        ? {
            where: {
              AND: [
                {
                  seller: {
                    Blocked: { none: { blockerId: userId } },
                  },
                },
                {
                  buyer: {
                    Blocked: { none: { blockerId: userId } },
                  },
                },
              ],
            },
            include: {
              buyer: true,
              seller: true,
            },
          }
        : {
            include: {
              buyer: true,
              seller: true,
            },
          },
      _count: true,
      likes: true,
      
    },
  });

  const hasMore = raw.length > take;
  const page = scoreListings(hasMore ? raw.slice(0, take) : raw, userId);
  const nextCursor = hasMore ? page[page.length - 1].lid : null;

  return { listings: page, nextCursor };
}

export async function getOthersListings(
  uid: string,
): Promise<ListingWithIncludes[]> {
  return prisma.listing.findMany({
    orderBy: { createdAt: "asc" },
    take: 50,
    where: {
      AND: [
        { sellerId: { not: uid } },
        {
          seller: {
            Blocked: {
              none: {
                blockerId: uid,
              },
            },
          },
        },
      ],
      archived: false,
    },
    include: { seller: true, conversations: true, _count: true, likes: true },
  });
}

export async function getUserListings(
  uid: string,
): Promise<ListingWithIncludes[]> {
  return prisma.listing.findMany({
    orderBy: { createdAt: "asc" },
    take: 20,
    where: { sellerId: uid },
    include: { seller: true, conversations: true, _count: true, likes: true },
  });
}

export async function getListingByID(
  lid: string,
  uid: string,
): Promise<ListingWithIncludes | null> {
  return prisma.listing.findUnique({
    where: { lid },
    include: {
      seller: true,
      conversations: uid
        ? {
            where: {
              AND: [
                {
                  seller: {
                    Blocked: { none: { blockerId: uid } },
                  },
                },
                {
                  buyer: {
                    Blocked: { none: { blockerId: uid } },
                  },
                },
              ],
            },
            include: {
              buyer: true,
              seller: true,
            },
          }
        : {
            include: {
              buyer: true,
              seller: true,
            },
          },
      _count: true,
      likes: true,
    },
  });
}

export async function createNewListing(listingData: ListingWithIncludes) {
  return prisma.listing.create({ data: { ...listingData } });
}

export async function updateListing(
  lid: string,
  listingData: ListingWithIncludes,
  uid: string,
): Promise<ListingWithIncludes> {
  return prisma.listing.update({
    data: { ...listingData },
    where: { lid },
    include: {
      seller: true,
      conversations: uid
        ? {
            where: {
              AND: [
                {
                  seller: {
                    Blocked: { none: { blockerId: uid } },
                  },
                },
                {
                  buyer: {
                    Blocked: { none: { blockerId: uid } },
                  },
                },
              ],
            },
            include: {
              buyer: true,
              seller: true,
            },
          }
        : {
            include: {
              buyer: true,
              seller: true,
            },
          },
      _count: true,
      likes: true,
    },
  });
}

export async function deleteListing(lid: string) {
  return prisma.listing.delete({ where: { lid } });
}
