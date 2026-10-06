"use client";

import { useListings } from "@/app/store/zustand";
import ListingModal from "@/components/Listings/ListingByID";
import { getListingByID } from "@/db/listings.db";
import { useParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { getUserSupabase } from "@/app/client-utils/functions";
const LID = () => {
  const params: { lid: string } = useParams();
  const { selectedListing, setSelectedListing } = useListings();

  const fetchByID = useCallback(
    async (id: string) => {
      const {user} = await getUserSupabase();

      const listing = await getListingByID(id,user?.id ? user?.id : "" );
      setSelectedListing(listing);
    },
    [setSelectedListing],
  );
  useEffect(() => {
    fetchByID(params.lid);
  }, [params.lid, fetchByID]);
  return (
    <>
      {selectedListing && <ListingModal listing={selectedListing} />}
    </>
  );
};

export default LID;
