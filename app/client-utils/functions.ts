"use client";

import { getSession } from "@/lib/lib";
import { getClientListings, getClientListingsNotUsers } from "@/lib/listing.lib";

export function cleanUP(listingStore, userStore) {
    
  userStore.reset();
  listingStore.reset();
}

export const fetchListings = async ({setter}: {setter: Function}) => {
  const session = await getSession();
  if (!session) {
    const temp = await getClientListings();
    setter(temp?.listings);

    return temp;
  } else {
    const temp = await getClientListingsNotUsers(session?.uid);
    setter(temp?.listings);

    return temp;
  }
};
