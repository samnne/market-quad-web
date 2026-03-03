'use client'
import { Listing } from "@/src/generated/prisma/client";
import Image from "next/image";
import { redirect } from "next/navigation";

interface DataCardProps {
    dataList: Listing[] | any[]
    href: string
}

const DataCard = ({dataList, href}: DataCardProps) => {
  return (
    <div className="flex gap-2 w-full py-2 overflow-x-auto h-full">
      {dataList.map((data, i) => {
        return (
          <div
            key={data ? data.lid ? data.lid : data : ""}
            onClick={() => {
              redirect(`${href}/${data?.lid || data}`);
            }}
           
            className="flex flex-col border shadow shadow-black/40   rounded-xl   min-w-60 h-full"
          >
            {/* Name */}
            <h4 className="w-full h-fit  pl-3 p-2 font-bold    text-black ">{data?.title || data}</h4>
          
            <Image src={data?.imageUrls?.length > 0 ? data.imageUrls[0] : `/nav-logo.svg`} className="w-full max-h-50 h-full" width={250} height={250}  alt="" />
          </div>
        );
      })}
    </div>
  );
};

export default DataCard;
