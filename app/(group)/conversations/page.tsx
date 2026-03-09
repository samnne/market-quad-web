"use client";

import { useConvos } from "@/app/store/zustand";
import { getConvos } from "@/lib/conversations.lib";
import { supabase } from "@/supabase/authHelper";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Conversations = () => {
  const { convos, setConvos } = useConvos();
  async function mountConvos() {
    const {data, error} = await supabase.auth.getUser()
    if (error){
      console.log("error")
      return
    }
    const tempConvos = await getConvos(data.user.id)

    setConvos(tempConvos)
  }
  useEffect(()=> {
    mountConvos()
  }, [])
  return (
    <main>
      {convos.map((convo) => {
        return (
          <section
          key={convo.cid}
            onClick={(e) => redirect(`/conversations/${convo.cid}`)}
            className="border-y gap-5 flex p-4 items-center h-20"
          >
            <div className="bg-accent w-12 h-12 rounded-full"></div>
            <header>
              <h3 className="text-xl font-medium">{convo.listing?.title}</h3>
              <span className="text-sm text-gray-400 ">
                Most recent message
              </span>
            </header>
            <div className="grow text-gray-400 h-full flex justify-end text-sm items-start">
              Delivered
            </div>
          </section>
        );
      })}
    </main>
  );
};

export default Conversations;
