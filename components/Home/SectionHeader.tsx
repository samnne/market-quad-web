"use client";

import { MdKeyboardArrowRight } from "react-icons/md";

const SectionHeader = ({title}: {title: string}) => {
  return (
    <div className="flex justify-between gap-2">
      <h3 className="text-2xl">{title}</h3>
      <button className="cursor-pointer">
        <MdKeyboardArrowRight className="text-3xl" />
      </button>
    </div>
  );
};

export default SectionHeader;
