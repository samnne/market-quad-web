import { cloudinaryLoader } from "@/app/client-utils/functions";
import { useListings } from "@/app/store/zustand";
import { Listing } from "@/src/generated/prisma/client";
import { motion } from "motion/react";
import Image from "next/image";
import { MdOutlineShoppingCart } from "react-icons/md";

const ListingCard = ({ listing }: { listing: Listing }) => {
  const { setSelectedListing } = useListings();
  function openListingModal(listing: Listing) {
    setSelectedListing(listing);
  }

  return (
    <motion.section
      whileTap={{
        scale: 0.95,
      }}
      onClick={() => openListingModal(listing)}
      className=" bg-pill  drop-shadow-xl text-white  relative flex flex-col gap-2 rounded-4xl"
      key={listing.lid}
    >
      <div className="h-48 relative ">
        <Image
          className=" rounded-t-4xl relative  w-full h-full object-cover bg-primary/25 z-100"
          loading="lazy"
          sizes="(max-width: 768px) 50vw, 33vw"
          loader={cloudinaryLoader}
          fill
          src={listing.imageUrls?.[0] || "/placeholder.jpg"}
          alt={listing.title}
        />
        <div className="absolute flex justify-center items-center inset-0 rounded-t-4xl w-full h-full object-cover  z-0">
          <div className=" w-20 h-20 rounded-full text-4xl text-black flex justify-center items-center">
            <MdOutlineShoppingCart />
          </div>
        </div>
      </div>

      <div className="p-4 font-inter rounded-2xl text-lg  overflow-hidden text-nowrap flex flex-col gap-1 justify-center">
        <h3 className="text-lg   text-black truncate">
          {" "}
          ${listing.price} ⋅ {listing.title}
        </h3>
        <span className="text-sm  text-accent/50 font-bold">
          {listing?.condition}
        </span>
        <p className="text-gray-400  text-sm text-nowrap  overflow-hidden">
          {listing.description}
        </p>
      </div>
      {(listing.sold || listing.archived) && (
        <div
          className={`absolute right-3 top-3 z-100  text-primary border border-primary text-sm rounded-lg flex justify-center items-center font-bold px-2 ${listing?.sold ? "text-red-500 bg-red-300 border-red-300" : "bg-text text-primary border-primary"}`}
        >
          {listing?.sold ? "SOLD" : listing.archived ? "ARCHIVED" : ""}
        </div>
      )}
    </motion.section>
  );
};

export default ListingCard;
