"use client";
import { ConvoWithRelations, ListingWithIncludes } from "@/app/types";
import { Conversation, Listing } from "@/src/generated/prisma/client";
import { motion, stagger, useAnimate } from "motion/react";

import { useEffect } from "react";
import ListingCard from "../Listings/ListingCard";
import ConversationCards from "./ConvoCard";

type DataCardProps =
  | { dataList: ListingWithIncludes[]; href: "listings" }
  | { dataList: ConvoWithRelations[]; href: "conversations" };

const DataCard = ({ dataList, href }: DataCardProps) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (scope.current) {
      animate(
        scope.current,
        {
          y: [25, 0],
          opacity: [0, 1],
        },
        {
          type: "keyframes",
          stiffness: 300,
          // when: "beforeChildren",
          duration: 0.4,
          delayChildren: stagger(0.2),
        },
      );
    }
  }, [scope, animate]);

  return (
    <motion.div
      ref={scope}
      className="flex  gap-2 w-full py-2 overflow-x-auto overflow-y-hidden no-scrollbar h-full"
    >
      {dataList.map((data: Listing | Conversation) => {
        if (href === "listings" ) {
          return <ListingCard key={(data as Listing)?.lid} listing={data as ListingWithIncludes} />
        }
       
      })}
      {href === 'conversations' &&  <ConversationCards convos={dataList as ConvoWithRelations[]} /> }
    </motion.div>
  );
};

export default DataCard;
