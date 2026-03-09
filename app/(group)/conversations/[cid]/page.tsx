"use client";

import { useMessage, useUser } from "@/app/store/zustand";
import { getMessagesForConvo, sendMessage } from "@/lib/messages.lib";
import { Message } from "@/src/generated/prisma/client";
import { supabase } from "@/supabase/authHelper";
import { redirect, useParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { IoArrowBack, IoArrowUp } from "react-icons/io5";

const CID = () => {
  const params = useParams();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState([]);
  const [rows, setInputRows] = useState(1);
  const [messageText, setMessageText] = useState("");
  const { setError } = useMessage();
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const { user, setUser } = useUser();

  async function mountMessages() {
    const cid = params.cid;
    if (!cid) return;
    const tempMessages = await getMessagesForConvo(cid);
    if (!tempMessages) {
      setError(true);
      return;
    }
    setMessages(tempMessages);
  }
  async function mountUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return;
    }
    setUser(data.user);
  }
  useEffect(() => {
    mountUser();
  }, []);
  useEffect(() => {
    mountMessages();
  }, [currentMessages]);

  useEffect(() => {
    const cid = params.cid;
    if (!cid) return;
  
    const channel = supabase
      .channel(`conversation:${cid}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Message",
          // ← your actual table name in Supabase
        },
        (payload) => {
          console.log(payload);
          mountMessages();
        },
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  },[]);
  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setMessageText((prev) => e.target.value);
  }
  async function handleSendMessage() {
    if (typeof params.cid === "undefined") return;
    const message = await sendMessage(
      {
        conversationId: params.cid,
        senderId: user.id,
        text: messageText,
      },
      user,
    );

    setMessageText("");
  }
  function emptyLine() {
    const lines = messageText.split("\n");
    return lines[lines.length - 1].length === 0;
  }
  const handleEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      setInputRows((prev) => prev + 1);
      console.log("Enter key pressed!", rows);
    } else if (e.key === "Backspace" && emptyLine()) {
      console.log("Enter key pressed!", rows);
      setInputRows((prev) => {
        if (prev !== 1) {
          return prev - 1;
        }
        return prev;
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <section className="absolute inset-0 z-50 bg-white w-screen min-h-screen overflow-y-auto">
      <nav
        className="w-screen  bg-white sticky border items-center flex justify-between p-4"
        id="navigation"
      >
        <button className="text-2xl" onClick={() => redirect("/conversations")}>
          <IoArrowBack />
        </button>
        <div className="text-2xl">{params?.cid}</div>
      </nav>
      <div className="w-full h-full max-h-[82dvh] overflow-y-auto flex gap-5 p-4 flex-col">
        {messages.map((message, i) => {
          return (
            <div
              key={i}
              className={`p-2 w-fit text-black  rounded-2xl ${message.senderId === user.id ? "self-end bg-primary" : "bg-secondary/50"}`}
            >
              {message.text}
            </div>
          );
        })}
        <div ref={messageEndRef} id="message-end"></div>
      </div>
      <div id="message-box" className="w-screen p-4    absolute bottom-0">
        <div className="flex justify-between gap-2 ">
          <textarea
            name="message"
            id="message"
            rows={rows}
            value={messageText}
            onKeyDown={handleEnter}
            onChange={handleChange}
            className="p-2 border w-full rounded-2xl border-black/50"
            placeholder="Type Your Message"
          />
          <button
            onClick={() => {
              handleSendMessage();
            }}
            className="px-4 py-2 font-bold text-white bg-primary rounded-2xl"
          >
            <IoArrowUp />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CID;
