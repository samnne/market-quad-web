"use client";
import { useRouter } from "next/navigation";

import { categories } from "@/app/client-utils/constants";
import { fetchConvos, fetchListings } from "@/app/client-utils/functions";
import { useConvos, useListings, useMessage } from "@/app/store/zustand";
import DataCard from "@/components/Home/DataCard";
import SectionHeader from "@/components/Home/SectionHeader";
import { motion, stagger, useAnimate } from "motion/react";
import { redirect } from "next/navigation";

import { useEffect, useState } from "react";

const MarketQuadHome = () => {
  const router = useRouter();
  const { listings, setListings } = useListings();
  const { convos, setConvos } = useConvos();
  const { setError } = useMessage();
  const [loading, setLoading] = useState(false);
  const [scope, animate] = useAnimate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (listings.length && convos?.length) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        await fetchListings({ setter: setListings });
        await fetchConvos({ setter: setConvos });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    if (!scope.current) return;
    try {
      animate(
        "section",
        { y: [50, 0], opacity: [0, 1] },
        { type: "keyframes", duration: 0.4, delay: stagger(0.2) },
      );
    } catch (err) {
      console.error("Animation error:", err);
    }
  }, []);
  const handleSearchByCat = (cat: string) => {
    router.push(`/listings?cat=${cat}`);
  };
  const handleSearchListings = async (e: SubmitEvent) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      if (!searchQuery.trim()) {
        setError(true);
        return;
      }

      router.push(`/listings?search=${encodeURIComponent(searchQuery)}`);
     
    } catch (err) {
      console.error("Error handling search:", err);
      setError(true);
    }
  };

  return (
    <div
      ref={scope}
      className="flex flex-col gap-6 px-5 pt-4 pb-6 bg-background min-h-full"
    >
      {/* Search bar */}

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-2xl outline focus-within:outline-4 transition-all outline-[#c8f5e8] px-4 py-3 flex items-center gap-2.5"
      >
        <svg
          className="w-4 h-4 shrink-0 opacity-35"
          viewBox="0 0 20 20"
          fill="none"
        >
          <circle cx="9" cy="9" r="6" stroke="#011d16" strokeWidth="1.5" />
          <path
            d="M13.5 13.5L17 17"
            stroke="#011d16"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <form onSubmit={(e) => handleSearchListings(e)}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e)=> setSearchQuery(e.target.value)}
            placeholder="Search textbooks, gear, notes…"
            className="text-sm text-[#6b9e8a] p-1 outline-0"
          />
        </form>
        <form onSubmit={(e)=>handleSearchListings(e)} className="ml-auto w-8 h-8 rounded-[9px] bg-primary flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 4h10M4 7h6M6 10h2"
              stroke="#011d16"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </form>
      </motion.div>

      {/* Category chips */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
        className="flex gap-2 overflow-x-auto no-scrollbar"
      >
        {categories.map((cat, i) => (
          <button
            key={cat}
            onClick={() => handleSearchByCat(cat)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-all ${
              i === 0
                ? "bg-[#011d16] text-[#17f3b5] border-[#011d16]"
                : "bg-white text-[#6b9e8a] border-[#c8f5e8]"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Listings */}
      <section className="flex flex-col gap-2 overflow-y-hidden">
        <SectionHeader type="listings" title="Today's Listings" />
        {loading ? (
          <div className="flex gap-3 py-2 overflow-x-auto no-scrollbar">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="shrink-0 min-w-[200px] h-[180px] rounded-xl bg-white border border-[#e0faf2] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <DataCard dataList={listings} href="listings" />
        )}
      </section>

      {/* Messages */}
      <section className="flex flex-col gap-2 overflow-y-hidden">
        <SectionHeader type="messages" title="Messages" />
        {loading ? (
          <div className="flex gap-3 py-2 overflow-x-auto no-scrollbar">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="shrink-0 min-w-[200px] h-[80px] rounded-xl bg-white border border-[#e0faf2] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <DataCard dataList={convos} href="conversations" />
        )}
      </section>

      {/* Sell banner */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#011d16] rounded-[18px] p-5 flex items-center justify-between overflow-hidden relative"
      >
        <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-[#17f3b5] opacity-10" />
        <div className="absolute bottom-[-30px] right-8 w-20 h-20 rounded-full bg-[#d282f9] opacity-15" />
        <div className="relative z-10">
          <p className="text-[11px] text-[#17f3b5] font-medium uppercase tracking-widest mb-1">
            Got stuff to offload?
          </p>
          <p className="text-[17px] font-extrabold text-white leading-tight">
            List an item
            <br />
            in 30 seconds
          </p>
        </div>
        <button
          onClick={() => redirect("/new")}
          className="relative z-10 shrink-0 bg-[#17f3b5] text-[#011d16] rounded-xl px-4 py-2.5 text-[13px] font-bold active:scale-95 transition-transform"
        >
          + Sell
        </button>
      </motion.div>
    </div>
  );
};

export default MarketQuadHome;
