"use client";

import { useListings } from "@/app/store/zustand";
import ListingModal from "@/components/Listings/ListingByID";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import NestedLayout from "./layout";

const LID = () => {
  const params = useParams();

  const { selectedListing, setSelectedListing, listings } = useListings();
  useEffect(() => {
    setSelectedListing(listings.find((l) => l.lid === params?.lid));
  }, []);
  return (
    <>
      <ListingModal listing={selectedListing} />
    </>
  );
};


export default LID;

LID.getLayout = function getLayout(page) {
return <NestedLayout>{page}</NestedLayout>;
};