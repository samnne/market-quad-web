
import ListingPage from "@/components/Listings/ListingsPage";
import { Suspense } from "react";


export default function Page() {
  return (
    // The fallback can be your SkeletonCard layout for a smooth transition
    <Suspense fallback={<div className="p-4">Loading listings...</div>}>
      <ListingPage />
    </Suspense>
  );
}
