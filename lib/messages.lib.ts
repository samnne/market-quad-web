"use server";
import { prisma } from "../db/db";

interface NewMessageProps {
  conversationId: string;
  text: string;
  senderId: string;
}

export async function sendMessage(newMessage: NewMessageProps, uid: string) {
  if (!newMessage.conversationId) throw new Error("conversationId is required");
  if (uid) {
    const message = await prisma.message.create({
      data: {
        text: newMessage.text,
        sender: {
          connect: { uid: newMessage.senderId },
        },
        conversation: {
          connect: { cid: newMessage.conversationId },
        },
      },
    });


    if (!message) {
      console.error("Error sending message:");
      return {
        error: "Failed to send message",
        success: false,
        new_message: null,
        message_text: newMessage.text,
      };
    }

    return { success: true, message: "Message Sent", new_message: message };
  }

  return { error: "User not authenticated", new_message: null };
}

export async function readMessages(cid: string, uid: string) {
  const result = await prisma.message.updateMany({
    where: {
      conversationId: cid,
      senderId: {
        not: uid, // Only target messages sent by the OTHER person
      },
      readAt: null, // Only update if it hasn't been read yet
    },
    data: {
      readAt: new Date().toISOString(),
    },
  });
  
  return result;
}

export async function getMessagesForConvo(cid: string, uid: string) {
  // 1. First, mark all unread messages from the other user as read
  await prisma.message.updateMany({
    where: {
      conversationId: cid,
      senderId: {
        not: uid,
      },
      readAt: null, 
    },
    data: {
      readAt: new Date().toISOString(),
    },
  });

  // 2. Then fetch the messages (they will now include the updated readAt timestamps)
  const messages = await prisma.message.findMany({
    where: {
      conversationId: cid,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!messages) {
    return false;
  }
  
  return messages;
}
